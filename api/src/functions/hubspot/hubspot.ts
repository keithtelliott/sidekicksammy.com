// DONE: Installable
// DONE: OAuth Callback
// DONE: Created tables and lookups work
// TODO: Way to manage the data as admins/and customers
// TODO: 1. Add dbauth
// TODO: 2. Add admin panel
// TODO: 3. Add customer panel
// TODO: 4. Add way to manage the data
// TODO: 5. Add endpoints fro the conected app

import { db } from 'src/lib/db'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import crypto from 'crypto'
import fetch from 'cross-fetch'

const {
  HUBSPOT_CLIENT_ID,
  HUBSPOT_CLIENT_SECRET,
  URL,
  NODE_ENV,
  SECRET_KEY,
} = process.env
const HUBSPOT_CLIENT_SCOPES = 'conversations.read,conversations.write,settings.users.read'
const convertCommaSeparatedToSpaceDelimited = (commaSeparatedString: string) => {
  let scopes = commaSeparatedString.split(',')
  scopes = scopes.map(scope => scope.trim());
  const SCOEPSTRING = scopes.join(' ')
  return SCOEPSTRING
}
const PROPER_SECRET_KEY = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);
const IV = crypto.createHash('sha256').update(String(process.env.IV)).digest('base64').substr(0, 16);
let encrypt = (text: string | object): string => {
  const input = typeof text === 'object' ? JSON.stringify(text) : text;
  const cipher = crypto.createCipheriv('aes-256-cbc', PROPER_SECRET_KEY, IV);
  const encrypted = Buffer.concat([cipher.update(input, 'utf8'), cipher.final()]);
  return encrypted.toString('hex');
}
let decrypt = (encryptedText: string): string => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', PROPER_SECRET_KEY, IV);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}

let SCOEPSTRING = ''
if (!HUBSPOT_CLIENT_SCOPES) throw new Error('NO HUBSPOT_CLIENT_SCOPES')
if (HUBSPOT_CLIENT_SCOPES.indexOf(',') === -1) throw new Error('HUBSPOT_CLIENT_SCOPES NEEDS TO BE COMMA DELIMITED')
if (HUBSPOT_CLIENT_SCOPES) SCOEPSTRING = convertCommaSeparatedToSpaceDelimited(HUBSPOT_CLIENT_SCOPES)
// next we need to define the oauthcallback url
const OAUTH_CALLBACK_URL = (() => {
  // if we are in dev mode we need to use localhost
  if (process.env.NODE_ENV === 'production' && process.env.URL) {
    return `https://${process.env.URL}/.redwood/functions/hubspot/oauth-callback`
  }
  return `http://localhost:8910/.redwood/functions/hubspot/oauth-callback`

})()
// next wee need to build the redirect url
const generateAuthUrl = (state) => {
  let url = 'https://app.hubspot.com/oauth/authorize'
  url += `?client_id=${HUBSPOT_CLIENT_ID}`
  url += `&scope=${SCOEPSTRING}`
  url += `&redirect_uri=${OAUTH_CALLBACK_URL}`
  // we need to to sha the state and store it in the db
  // poor mans sha for now
  // we'll pass in a cuid + random string
  let encryptedState = encrypt(state)
  url += `&state=${encryptedState}`
  return url
}
const refreshTokenStore = {};
const exchangeForTokens = async (sessionId: string, proof: any) => {
  let authTokenUrl = 'https://api.hubapi.com/oauth/v1/token'
  let formData = ''
  for (let key in proof) {
    formData += `${key}=${proof[key]}&`
  }
  formData = formData.substring(0, formData.length - 1)
  const response = await fetch(authTokenUrl + '?' + formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    method: 'POST',
  });
  const tokens = await response.json();
  refreshTokenStore[sessionId] = tokens.refresh_token;
  let decodedState = decrypt(sessionId)
  let parsedState = JSON.parse(decodedState)
  let userId = parseInt(parsedState.state, 10)
  if (!userId) throw new Error('Missing Proper State')
  // lets store the refresh token in the database
  let expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in)
  let botData = {
    hsRefreshToken: tokens.refresh_token,
    hsAccessTokenExpiresAt: expiresAt,
    hsAccessToken: tokens.access_token,
  }

  // we need to get the ... bot details
  // to do that we need to call
  // https://api.hubspot.com/oauth/v1/access-tokens/{{ACCESS_TOKEN}}
  await fetch('https://api.hubspot.com/oauth/v1/access-tokens/' + tokens.access_token, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    // then get the json
  }).then(async (response) => {
    const data = await response.json();
    botData['hsPortalId'] = data.hub_id
    botData['hsAppId'] = data.app_id
    botData['hsUserId'] = data.user_id
    botData['urlSlug'] = data.hub_domain
  });

  let bot = await db.bot.findFirst({ where: { userId } })
  if (!bot) {
    bot = await db.bot.create({
      data: {
        ...botData,
        User: {
          connect: {
            id: userId
          }
        }
      }
    })
  }
  if (bot) {
    bot = await db.bot.update({
      where: { id: bot.id },
      data: botData
    })
  }

  return tokens.access_token;
}
let handleOauthCallback = async ({ code, sessionId }) => {
  const authCodeProof = {
    grant_type: 'authorization_code',
    client_id: HUBSPOT_CLIENT_ID,
    client_secret: HUBSPOT_CLIENT_SECRET,
    redirect_uri: OAUTH_CALLBACK_URL,
    code
  }
  const tokens = await exchangeForTokens(sessionId, authCodeProof)
  return tokens.access_token
}
let updateAccessToken = async (botId: number) => {
    let bot = await db.bot.findFirst({ where: { id: botId } })
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: HUBSPOT_CLIENT_ID,
    client_secret: HUBSPOT_CLIENT_SECRET,
    redirect_uri: OAUTH_CALLBACK_URL,
    refresh_token: bot.hsRefreshToken
  }
  let botData = {}
  //send a form encoded request
  await fetch('https://api.hubapi.com/oauth/v1/token', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    body: Object.keys(refreshTokenProof).map(key => `${key}=${refreshTokenProof[key]}`).join('&'),
    method: 'POST',
    // then get the json
  }).then(async (response) => {
    // if status code !== 200
    // then we need to refresh the token
    let expiresDate = new Date()
    const data = await response.json();
    expiresDate.setSeconds(expiresDate.getSeconds() + data.expires_in)
    botData['hsAccessToken'] = data.access_token
    botData['hsAccessTokenExpiresAt'] = expiresDate
    // lets update the bot
    console.log({ status: 'updateAccessToken', botId, botData })
    bot = await db.bot.update({
      where: { id: botId },
      data: botData
    })
    return bot.hsAccessToken
  });
  throw new Error('Unable to update access token')
}
let refreshAccessToken = async (sessionId: string) => {
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: HUBSPOT_CLIENT_ID,
    client_secret: HUBSPOT_CLIENT_SECRET,
    redirect_uri: OAUTH_CALLBACK_URL,
    refresh_token: refreshTokenStore[sessionId]
  }
  const tokens = await exchangeForTokens(sessionId, refreshTokenProof)
  return tokens.access_token
}

let isNewConversation = ({ messageObj }) => {
  return messageObj.subscriptionType === 'conversation.creation'
}
let isNewMessage = ({ messageObj }) => {
  return messageObj.subscriptionType === 'conversation.newMessage'
}
let getThreadMessages = async ({ bot, threadId }) => {
  let threadsUrl = `https://api.hubspot.com/conversations/v3/conversations/threads/${threadId}/messages`
  let threadsOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bot.hsAccessToken}`
    }
  }
  let threadsResponse = await fetch(threadsUrl, threadsOptions)
  let threadsData = await threadsResponse.json()
  //console.log({ threadsData })
  let mappedData = threadsData.results.map((message) => {
    return {
      actorId: message.senders[0].actorId,
      text: message.text,
      channelId: parseInt(message.channelId, 10),
      channelAccountId: parseInt(message.channelAccountId, 10),
      truncatedStatus: message.truncationStatus,
    }
  })
  // filter out system messages
  mappedData = mappedData.filter((message) => {
    return message.actorId.indexOf('S-') === -1
  })
  let lastThreeMessages = mappedData.slice(0, 3)
  return lastThreeMessages
}
let getThreadDetails = async ({ bot, threadId }) => {
  let threadUrl = `https://api.hubspot.com/conversations/v3/conversations/threads/${threadId}`;
  let threadOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bot.hsAccessToken}`
    }
  }
  let threadResponse = await fetch(threadUrl, threadOptions)
  let threadData = await threadResponse.json()
  return threadData
}
let getFixieChunks = async ({ query, fixieCorpusId }) => {
  console.log({ status: 'getFixieChunks', query, fixieCorpusId })
  if (!fixieCorpusId) return []  // throw new Error('Missing Fixie Corpus Id')
  if (!query) return []  // throw new Error('Missing Query')
  if (!process.env.FIXIE_API_KEY) return []  // throw new Error('Missing Fixie API Key')
  console.log({ status: 'getFixieChunks', query, fixieCorpusId, FIXIE_API_KEY: process.env.FIXIE_API_KEY })
  let fixieUrl = `https://api.fixie.ai/api/v1/corpora/${fixieCorpusId}/query`;
  let fixieOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FIXIE_API_KEY}`
    },
    body: JSON.stringify({
      corpusId: fixieCorpusId,
      query,
      maxChunks: 3,
      rerankResults: 'RERANK_RESULTS_UNSPECIFIED'
    })
  }
  let fixieResponse = await fetch(fixieUrl, fixieOptions)
  let fixieData = await fixieResponse.json()
  return fixieData.results
}
let sendMessageToHubspot = async ({ bot, message, threadId, channelId, channelAccountId }) => {
  let messageUrl = `https://api.hubspot.com/conversations/v3/conversations/threads/${threadId}/messages`
  let messageOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bot.hsAccessToken}`
    },
    body: JSON.stringify({
      type: 'MESSAGE',
      text: message,
      senderActorId: 'A-' + bot.hsUserId,
      channelId,
      channelAccountId,
      subject: 'Follow up'
    })
  }
  let messageResponse = await fetch(messageUrl, messageOptions)
  let messageData = await messageResponse.json()
  console.log({ messageData })
  return messageData
}
let openAIRequest = async ({ message, prompt }) => {
    let openAIUrl = 'https://api.openai.com/v1/chat/completions'
  let openAIOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-16k',
      messages: [...prompt, { role: 'user', content: message }],
      temperature: 0.9,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  }
  let openAIResponse = await fetch(openAIUrl, openAIOptions)
  let openAIData = await openAIResponse.json()
  return openAIData.choices[0].message.content
}
let returnHtml = (content: string) => {
  let html = `
    <html>
      <head>
        <title>Hubspot App</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            color: #333;
          }
          .content {
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Hubspot App</h1>
          <nav>
            <ul>
              <li><a href="/.redwood/functions/hubspot/">Home</a></li>
            </ul>
          </nav>
          <!-- semantic element for content -->
          <article>
            ${content}
          </article>
        </main>
      </body>
    </html>
    `
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: html
  }
}

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: hubspot function`)
  // exit if no HUBSPOT_CLIENT_ID or HUBSPOT_CLIENT_SECRET
  if (!HUBSPOT_CLIENT_ID || !HUBSPOT_CLIENT_SECRET) {
    throw new Error('Hubspot Function - NO CLIENT ID OR SECRET')
  }
  // exit if production and no url
  if (NODE_ENV === 'production' && !URL) {
    throw new Error('Hubspot Function - NO URL')
  }
  // exit if no scopes
  if (!HUBSPOT_CLIENT_SCOPES) {
    throw new Error('Hubspot Function - NO SCOPES')
  }
  // determine if this is the oauth callback or install
  let isOauthCallback = event.path === '/hubspot/oauth-callback'
  if (isOauthCallback) {
    try {
      const { code, state } = event.queryStringParameters
      await handleOauthCallback({ code, sessionId: state })
      return returnHtml(`
      <p>App installed successfully!</p>
    `)
    } catch (e) {
      // on error
      console.log(e)
      return returnHtml(`
        <p>There was an error installing the app</p>
        <pre
          style="background: #eee; padding: 20px; border-radius: 5px;"
        >${e.message}</pre>
      `)
    }
  }
  // i'm going to add some more end points;
  // we're going to add endpoints for getting values
  // if endpoint is /hubspot/bot/:slug
  // return json of all users
  let isUserSelect = event.path.indexOf('/hubspot/getUsers') > -1
  if (isUserSelect) {
    // lets read teh post body;
    // they pass a number of url params
    /**Enter a valid URL without reserved query parameters (actionType, portalId, userId, userEmail, accountId, and appId). */
    let body = (event.body)
    let parsedBody = JSON.parse(body)
    let params = {}
    for (let key in parsedBody) {
      // od a typeof number check
      if (!isNaN(parsedBody[key])) {
        params[key] = parseInt(parsedBody[key], 10)
      }
      if (isNaN(parsedBody[key])) {
        params[key] = parsedBody[key]
      }
    }
        let isUpdate = params.actionType === 'DROPDOWN_UPDATE'
    if (isUpdate) {
      // update the bot's hsUserId
      let bot = await db.bot.findFirst({ where: { hsPortalId: params.portalId } })
      if (bot) {
        if (params.selectedOption === '') params.selectedOption = null
        bot = await db.bot.update({
          where: { id: bot.id },
          data: {
            hsUserId: params.selectedOption
          }
        })
      }
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actionType: 'DROPDOWN_UPDATE',
          response: {
            options: [],
            selectedOption: params.userId,
            placeholder: 'Pick a user'
          },
          message: null
        })
      }
    }
    let isFetch = params.actionType === 'DROPDOWN_FETCH'
        if (isFetch) {
      let options = []
      let bot = await db.bot.findFirst({ where: { hsPortalId: params.portalId } })
      if (!bot) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            actionType: 'DROPDOWN_FETCH',
            response: {
              options: [
                {
                  text: 'No Bot Found',
                  value: ''
                }
              ],
              selectedOption: '',
              placeholder: 'Bot Not Found'
            },
            message: null
          })
        }
      }
      let accessToken = bot.hsAccessToken;
      // okay we have the bot
      // now lets refresh the token using updateAccessToken
      // lets see if we need to update the access token
      let now = new Date()
      let expiresAt = new Date(bot.hsAccessTokenExpiresAt)
      let needsNewToken = now > expiresAt
      if (needsNewToken) {
        // lets update the access token
        accessToken = await updateAccessToken(bot.id)
      }
      let headers = {
        'Authorization': `Bearer ${accessToken}`
      }
      let responseBody = {}
      await fetch('https://api.hubspot.com/settings/v3/users/', {
        headers,
        method: 'GET',
        // then get the json
      }).then(async (response) => {
        // lets return the results where value = id, and text = email
        const data = await response.json();
        options = data.results.map((user) => {
          return {
            text: user.email,
            value: user.id
          }
        })
        options.unshift({
          text: 'No One',
          value: ''
        })
        responseBody = {
          actionType: 'DROPDOWN_FETCH',
          response: {
            options,
            selectedOption: bot.hsUserId,
            placeholder: 'Pick a user'
          },
          message: null
        }
      })
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseBody)
      }
    }

  }

  let isBotActive = event.path.indexOf('/hubspot/getActive') > -1
  if (isBotActive) {
    let responseBody = {
      actionType: "TOGGLE_FETCH",
      response: {
        enabled: null
      },
      message: null
    }

    let body = event.body
    let parsedBody = JSON.parse(body)// this isn't working
    let params = {}
    for (let key in parsedBody) {
      // od a typeof number check
      if (!isNaN(parsedBody[key])) {
        params[key] = parseInt(parsedBody[key], 10)
      }
      if (isNaN(parsedBody[key])) {
        params[key] = parsedBody[key]
      }
      //if value if value is "true" or "false" then convert to boolean
      if (params[key] === 'true') params[key] = true
      if (params[key] === 'false') params[key] = false
    }
    console.log({ params })
    let isActiveFetch = params.actionType === 'TOGGLE_FETCH'
    let isActiveUpdate = params.actionType === 'TOGGLE_UPDATE'
    console.log({
      status: 'isBotActive',
      actionType: params.actionType,
      isActiveFetch,
      isActiveUpdate
    })
    if (isActiveFetch) {
      let bot = await db.bot.findFirst({
        where: { hsPortalId: params.portalId },
        select: {
          hsActive: true,
          title: true
        }
      })
      responseBody.response.enabled = bot?.hsActive
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseBody)
      }
    }
    if (isActiveUpdate) {
      let bot = await db.bot.findFirst({ where: { hsPortalId: params.portalId } })
      if (bot) {
        let data = {
          hsActive: params.enabled
        }
        console.log({ data })
        bot = await db.bot.update({
          where: { id: bot.id },
          data
        })
      }
      responseBody.response.enabled = params.enabled
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseBody)
      }
    }
  }

  let isBot = event.path.indexOf('/hubspot/bot/') > -1
  if (isBot) {
    // okay the path is /hubspot/bot/
    // from here we have the following body;
    /**
     * {
  "eventId": 3269195544,
  "subscriptionId": 2371671,
  "portalId": 23428445, // hubspot account id
  "appId": 2438486, // installed app id
  "occurredAt": 1702439388898,
  "subscriptionType": "conversation.newMessage",
  "attemptNumber": 0,
  "objectId": 6065362089, // for converstaions, this is the threadId
  "messageId": "9b38dc6d5b5744a788931a9cf3a7b225",
  "messageType": "MESSAGE",
  "changeFlag": "NEW_MESSAGE"
}
     */
    console.log({ path: event.path, body: JSON.parse(event.body) })
    // loop over each message
    let messageArr = JSON.parse(event.body)
    messageArr.forEach(async (messageObj) => {
      // so lets comment this out how it will work
      // 1. visitor will send a message
      // 2. hubspot will log the message
      // 3. hubspot will send a webhook to our app
      // 4. we will get the webhook
      // 5. we will lookup the bot by the hubspot account id, if not found return error
      let bot = await db.bot.findFirst({ where: { hsPortalId: messageObj.portalId } })

      // is the bot active
      console.log({
        bot: {
          hsActive: bot.hsActive,
          hsUserId: bot.hsUserId,
          fixieCorpusId: bot.fixieCorpusId,
        }
      })
      if (!bot.hsActive) return
      // is the bot's access token expired
      let now = new Date()
      let expiresAt = new Date(bot.hsAccessTokenExpiresAt)
      let needsNewToken = now > expiresAt
      if (needsNewToken) {
        // lets update the access token
        bot.hsAccessToken = await updateAccessToken(bot.id)
      }

      // 6. define if this is a new conversation or a new message
      let isNewConversation = messageObj.subscriptionType === 'conversation.creation'
      let isNewMessage = messageObj.subscriptionType === 'conversation.newMessage'
      // okay handle new message handleNewMessage({messageObj})
      // 7. if new message, look up the thread by the threadId, if not found return error
      if (isNewMessage) {
        console.log("NEW MESSAGE")
        // we can do both these calls at the same time
        Promise.all([
          getThreadDetails({ bot, threadId: messageObj.objectId }),
          getThreadMessages({ bot, threadId: messageObj.objectId })
        ]).then(async (values) => {
          let [threadDetails, lastThreeMessages] = values
          console.log({ threadDetails, lastThreeMessages })
          // 8. define messages, and lastMessage
          // 8. define the assignedTo, assignedToNoOne(bool), assignedToAI(bool), and assignedToSomeoneElse(bool)
          // 8. define the from actor (https://developers.hubspot.com/docs/api/conversations/conversations#endpoint?spec=GET-/conversations/v3/conversations/actors/{actorId})
          let assignedTo = threadDetails.assignedTo
          let assignedToNoOne = typeof assignedTo === 'undefined'
          let assignedToAI = assignedTo === 'A-' + bot.hsUserId
          let lastMessageFrom = lastThreeMessages[0].actorId
          let lastMessageFromBot = lastMessageFrom === 'A-' + bot.hsUserId
          if (lastMessageFromBot) return
          //let assignedToSomeoneElse = assignedTo !== bot.hsUserId
          console.log({
            assignedTo,
            assignedToNoOne,
            assignedToAI,
            //            assignedToSomeoneElse
          })
          // - starts with 'A-' is a user account
          // - starts with 'E-' is an email address
          // - starts with 'I- is an integration actor.  used by actons by an integration "I-{AppId}"
          // - starts with 'S- is a system actor.  used by actions by the system
          // - starts with 'V- is a visitor actor.  used by actions by the visitor

          // 9. if assigned to someone else, return exit
          //if(assignedToSomeoneElse) return
          // 10. if assigned to no one or assigned to ai then get the appropriate context from fixie
          if (assignedToNoOne || assignedToAI) {
            // lets get the relevant content from fixie
            let chunks = await getFixieChunks({ query: lastThreeMessages[0].text, fixieCorpusId: bot.fixieCorpusId })
            console.log({
              chunks: chunks.map((chunk) => {
                return {
                  score: chunk.score,
                  chunkContentLength: chunk.chunkContent.length,
                  citationUrl: chunk.citation.publicUrl,
                  citationTitle: chunk.citation.title,
                }
              })
            })
            // lets only use chunks where the score is >= .75
            chunks = chunks.filter((chunk) => {
              return chunk.score >= .75
            })
            // if we have no chunks, then let's respond with a message
            if(chunks.length === 0) { /**send message */}
            let chunkString = chunks.map((chunk) => {
              return chunk.chunkContent
            }).join(' ')
            // lets get the hsPrompt
            let hsPrompt = JSON.parse(bot.hsPrompt)
            // hsPrompt is an array of objects { role: "system | assistant | user", content: "string" }
            // we need to replace the system's message's handlebars {{context}} with the chunk's content
            hsPrompt = hsPrompt.map((prompt) => {
              if (prompt.role === 'system') {
                prompt.content = prompt.content.replace('{{context}}', chunkString)
              }
              return prompt
            })
            // lets call openAI
            let openAIResponse = await openAIRequest({ message: lastThreeMessages[0].text, prompt: hsPrompt })

            let sendData = {
              bot,
              message: openAIResponse,
              threadId: messageObj.objectId,
              channelId: lastThreeMessages[0].channelId,
              channelAccountId: lastThreeMessages[0].channelAccountId
            }
            console.log({ sendData })
            await sendMessageToHubspot(sendData)
          }

          // 11. then send a message to openai to build a short response
          // 12. append the sources
        })

      }

    })

    //
    /*
    let slug = event.path.split('/hubspot/bot/')[1]
    let bot = await db.bot.findFirst({ where: { urlSlug: slug } })
    if (!account) return returnHtml(`<p>Account Not Found</p>`)
    let hubspotBot = await db.bot.findFirst({ where: { customerId: customer.id } })
    if (!hubspotBot) return returnHtml(`<p>Bot Not Found</p>`)
    return returnHtml(`
      <p>Bot</p>
      <details>
      <summary>Tech Details</summary>
      <pre
        style="background: #eee; padding: 20px; border-radius: 5px;"
      >${JSON.stringify(hubspotBot, null, 2)}</pre>
      </details>
    `)

    */
  }
  let STATE_FROM_URL = (() => {
    let state = event.queryStringParameters.state
    if (!state) {
      return null
    }
    return state
  })()
  return returnHtml(`
    <a href="${generateAuthUrl({ state: STATE_FROM_URL })}">Install App</a>
    <p>${STATE_FROM_URL}</p>
    <p>${encrypt(STATE_FROM_URL)}</p>
  `)
}
