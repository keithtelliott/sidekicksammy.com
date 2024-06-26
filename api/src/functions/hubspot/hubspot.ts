// DONE: Installable
// DONE: OAuth Callback
// DONE: Created tables and lookups work
// TODO: Way to manage the data as admins/and customers
// TODO: 1. Add dbauth
// TODO: 2. Add admin panel
// TODO: 3. Add customer panel
// TODO: 4. Add way to manage the data
// TODO: 5. Add endpoints fro the conected app

import crypto from 'crypto'

import type { APIGatewayEvent, Context } from 'aws-lambda'
import fetch from 'cross-fetch'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const { HUBSPOT_CLIENT_ID, HUBSPOT_CLIENT_SECRET, URL, NODE_ENV, SECRET_KEY } =
  process.env
const HUBSPOT_CLIENT_SCOPES =
  'conversations.read,conversations.write,settings.users.read'
const convertCommaSeparatedToSpaceDelimited = (
  commaSeparatedString: string
) => {
  let scopes = commaSeparatedString.split(',')
  scopes = scopes.map((scope) => scope.trim())
  const SCOEPSTRING = scopes.join(' ')
  return SCOEPSTRING
}
const PROPER_SECRET_KEY = crypto
  .createHash('sha256')
  .update(String(SECRET_KEY))
  .digest('base64')
  .substr(0, 32)
const IV = crypto
  .createHash('sha256')
  .update(String(process.env.IV))
  .digest('base64')
  .substr(0, 16)
const encrypt = (text: string | object): string => {
  const input = typeof text === 'object' ? JSON.stringify(text) : text
  const cipher = crypto.createCipheriv('aes-256-cbc', PROPER_SECRET_KEY, IV)
  const encrypted = Buffer.concat([
    cipher.update(input, 'utf8'),
    cipher.final(),
  ])
  return encrypted.toString('hex')
}
const decrypt = (encryptedText: string): string => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', PROPER_SECRET_KEY, IV)
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, 'hex')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}

let SCOEPSTRING = ''
if (!HUBSPOT_CLIENT_SCOPES) throw new Error('NO HUBSPOT_CLIENT_SCOPES')
if (HUBSPOT_CLIENT_SCOPES.indexOf(',') === -1)
  throw new Error('HUBSPOT_CLIENT_SCOPES NEEDS TO BE COMMA DELIMITED')
if (HUBSPOT_CLIENT_SCOPES)
  SCOEPSTRING = convertCommaSeparatedToSpaceDelimited(HUBSPOT_CLIENT_SCOPES)
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
  const encryptedState = encrypt(state)
  url += `&state=${encryptedState}`
  return url
}
const refreshTokenStore = {}
const exchangeForTokens = async (sessionId: string, proof: any) => {
  const authTokenUrl = 'https://api.hubapi.com/oauth/v1/token'
  let formData = ''
  for (const key in proof) {
    formData += `${key}=${proof[key]}&`
  }
  formData = formData.substring(0, formData.length - 1)
  const response = await fetch(authTokenUrl + '?' + formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    method: 'POST',
  })
  const tokens = await response.json()
  refreshTokenStore[sessionId] = tokens.refresh_token
  const decodedState = decrypt(sessionId)
  const parsedState = JSON.parse(decodedState)
  const userId = parseInt(parsedState.state, 10)
  if (!userId) throw new Error('Missing Proper State')
  // lets store the refresh token in the database
  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in)
  const botData = {
    hsRefreshToken: tokens.refresh_token,
    hsAccessTokenExpiresAt: expiresAt,
    hsAccessToken: tokens.access_token,
  }

  // we need to get the ... bot details
  // to do that we need to call
  // https://api.hubspot.com/oauth/v1/access-tokens/{{ACCESS_TOKEN}}
  await fetch(
    'https://api.hubspot.com/oauth/v1/access-tokens/' + tokens.access_token,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      // then get the json
    }
  ).then(async (response) => {
    const data = await response.json()
    botData['hsPortalId'] = data.hub_id
    botData['hsAppId'] = data.app_id
    botData['hsUserId'] = data.user_id
    botData['urlSlug'] = data.hub_domain
  })

  let bot = await db.bot.findFirst({ where: { userId } })
  if (!bot) {
    bot = await db.bot.create({
      data: {
        ...botData,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }
  if (bot) {
    bot = await db.bot.update({
      where: { id: bot.id },
      data: botData,
    })
  }

  return tokens.access_token
}
const handleOauthCallback = async ({ code, sessionId }) => {
  const authCodeProof = {
    grant_type: 'authorization_code',
    client_id: HUBSPOT_CLIENT_ID,
    client_secret: HUBSPOT_CLIENT_SECRET,
    redirect_uri: OAUTH_CALLBACK_URL,
    code,
  }
  const tokens = await exchangeForTokens(sessionId, authCodeProof)
  return tokens.access_token
}
const getAccessToken = async (refreshToken: string) => {
  // this is like updateAccessToken, but we'll just retrun data.access_token
  try {
    const refreshTokenProof = {
      grant_type: 'refresh_token',
      client_id: HUBSPOT_CLIENT_ID,
      client_secret: HUBSPOT_CLIENT_SECRET,
      redirect_uri: OAUTH_CALLBACK_URL,
      refresh_token: refreshToken,
    }
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: Object.keys(refreshTokenProof)
        .map((key) => `${key}=${refreshTokenProof[key]}`)
        .join('&'),
      method: 'POST',
      // then get the json
    })
    const data = await response.json()
    return data.access_token
  } catch (e) {
    // if we get an error, then we need throw the error
    throw new Error(e)
  }
}
const updateAccessToken = async (botId: number) => {
  try {
    let bot = await db.bot.findFirst({ where: { id: botId } })
    const refreshTokenProof = {
      grant_type: 'refresh_token',
      client_id: HUBSPOT_CLIENT_ID,
      client_secret: HUBSPOT_CLIENT_SECRET,
      redirect_uri: OAUTH_CALLBACK_URL,
      refresh_token: bot.hsRefreshToken,
    }
    const botData = {}
    //send a form encoded request
    await fetch('https://api.hubapi.com/oauth/v1/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: Object.keys(refreshTokenProof)
        .map((key) => `${key}=${refreshTokenProof[key]}`)
        .join('&'),
      method: 'POST',
      // then get the json
    }).then(async (response) => {
      // if status code !== 200
      // then we need to refresh the token
      const expiresDate = new Date()
      const data = await response.json()
      expiresDate.setSeconds(expiresDate.getSeconds() + data.expires_in)
      botData['hsAccessToken'] = data.access_token
      botData['hsAccessTokenExpiresAt'] = expiresDate
      // lets update the bot
      //console.log({ status: 'updateAccessToken', botId, botData })
      bot = await db.bot.update({
        where: { id: botId },
        data: botData,
      })
      console.log({ status: 'updateAccessToken', botId })
    })
    return 'success'
  } catch (e) {
    return e
  }
}

const refreshAccessToken = async (sessionId: string) => {
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: HUBSPOT_CLIENT_ID,
    client_secret: HUBSPOT_CLIENT_SECRET,
    redirect_uri: OAUTH_CALLBACK_URL,
    refresh_token: refreshTokenStore[sessionId],
  }
  const tokens = await exchangeForTokens(sessionId, refreshTokenProof)
  return tokens.access_token
}

const isNewConversation = ({ messageObj }) => {
  return messageObj.subscriptionType === 'conversation.creation'
}
const isNewMessage = ({ messageObj }) => {
  return messageObj.subscriptionType === 'conversation.newMessage'
}
const getThreadMessages = async ({ bot, threadId }) => {
  // get new access token
  const accessToken = await getAccessToken(bot.hsRefreshToken)
  const threadsUrl = `https://api.hubspot.com/conversations/v3/conversations/threads/${threadId}/messages`
  const threadsOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  }
  const threadsResponse = await fetch(threadsUrl, threadsOptions)
  const threadsData = await threadsResponse.json()
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
  //console.log({ mappedData })
  mappedData = mappedData.filter((message) => {
    return message.actorId.indexOf('S-') === -1
  })
  const lastThreeMessages = mappedData.slice(0, 3)
  return lastThreeMessages
}
const getThreadDetails = async ({ bot, threadId }) => {
  const accessToken = await getAccessToken(bot.hsRefreshToken)
  const threadUrl = `https://api.hubspot.com/conversations/v3/conversations/threads/${threadId}`
  const threadOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  }
  const threadResponse = await fetch(threadUrl, threadOptions)
  const threadData = await threadResponse.json()
  return threadData
}
const getFixieChunks = async ({ query, fixieCorpusId }) => {
  //console.log({ status: 'getFixieChunks', query, fixieCorpusId })
  if (!fixieCorpusId) return [] // throw new Error('Missing Fixie Corpus Id')
  if (!query) return [] // throw new Error('Missing Query')
  if (!process.env.FIXIE_API_KEY) return [] // throw new Error('Missing Fixie API Key')
  //console.log({ status: 'getFixieChunks', query, fixieCorpusId, FIXIE_API_KEY: process.env.FIXIE_API_KEY })
  const fixieUrl = `https://api.fixie.ai/api/v1/corpora/${fixieCorpusId}/query`
  const fixieOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIXIE_API_KEY}`,
    },
    body: JSON.stringify({
      corpusId: fixieCorpusId,
      query,
      maxChunks: 3,
      rerankResults: 'RERANK_RESULTS_UNSPECIFIED',
    }),
  }
  const fixieResponse = await fetch(fixieUrl, fixieOptions)
  const fixieData = await fixieResponse.json()
  return fixieData.results
}
const sendMessageToHubspot = async ({
  bot,
  message,
  threadId,
  channelId,
  channelAccountId,
}) => {
  console.log({ message })
  const accessToken = await getAccessToken(bot.hsRefreshToken)
  const messageUrl = `https://api.hubspot.com/conversations/v3/conversations/threads/${threadId}/messages`
  const messageOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      type: 'MESSAGE',
      text: message,
      senderActorId: 'A-' + bot.hsUserId,
      channelId,
      channelAccountId,
      subject: 'Follow up',
    }),
  }
  const messageResponse = await fetch(messageUrl, messageOptions)
  const messageData = await messageResponse.json()
  //console.log({ messageData })
  return messageData
}
const openAIRequest = async ({ message, prompt }) => {
  const openAIUrl = 'https://api.openai.com/v1/chat/completions'
  const openAIOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-16k',
      messages: [...prompt, { role: 'user', content: message }],
      temperature: 0.9,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  }
  const openAIResponse = await fetch(openAIUrl, openAIOptions)
  const openAIData = await openAIResponse.json()
  return openAIData.choices[0].message.content
}
const returnHtml = (content: string) => {
  const html = `
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
      'Content-Type': 'text/html',
    },
    body: html,
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
  // determine if this is the token refresh call
  const isTokenRefresh = event.path === '/hubspot/token-refresh'
  if (isTokenRefresh) {
    // lets loop over all the bots where the access token is set
    // and then refresh the token
    const bots = await db.bot.findMany({
      where: { hsAccessToken: { not: null } },
    })
    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i]
      //bots.forEach(async (bot) => {
      // lets refresh the token
      try {
        console.log({ message: 'refreshing token', botId: bot.id })
        const status = await updateAccessToken(bot.id)
        console.log({ message: 'refreshed token', botId: bot.id, status })
      } catch (e) {
        console.log({ e })
      }
      //})
    }
  }
  // determine if this is the oauth callback or install
  const isOauthCallback = event.path === '/hubspot/oauth-callback'
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
  const isUserSelect = event.path.indexOf('/hubspot/getUsers') > -1
  if (isUserSelect) {
    // lets read teh post body;
    // they pass a number of url params
    /**Enter a valid URL without reserved query parameters (actionType, portalId, userId, userEmail, accountId, and appId). */
    const body = event.body
    const parsedBody = JSON.parse(body)
    const params = {}
    for (const key in parsedBody) {
      // od a typeof number check
      if (!isNaN(parsedBody[key])) {
        params[key] = parseInt(parsedBody[key], 10)
      }
      if (isNaN(parsedBody[key])) {
        params[key] = parsedBody[key]
      }
    }
    const isUpdate = params.actionType === 'DROPDOWN_UPDATE'
    if (isUpdate) {
      // update the bot's hsUserId
      let bot = await db.bot.findFirst({
        where: { hsPortalId: params.portalId },
      })
      if (bot) {
        if (params.selectedOption === '') params.selectedOption = null
        bot = await db.bot.update({
          where: { id: bot.id },
          data: {
            hsUserId: params.selectedOption,
          },
        })
      }
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'DROPDOWN_UPDATE',
          response: {
            options: [],
            selectedOption: params.userId,
            placeholder: 'Pick a user',
          },
          message: null,
        }),
      }
    }
    const isFetch = params.actionType === 'DROPDOWN_FETCH'
    if (isFetch) {
      let options = []
      const bot = await db.bot.findFirst({
        where: { hsPortalId: params.portalId },
      })
      if (!bot) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            actionType: 'DROPDOWN_FETCH',
            response: {
              options: [
                {
                  text: 'No Bot Found',
                  value: '',
                },
              ],
              selectedOption: '',
              placeholder: 'Bot Not Found',
            },
            message: null,
          }),
        }
      }
      const accessToken = bot.hsAccessToken
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      }
      let responseBody = {}
      await fetch('https://api.hubspot.com/settings/v3/users/', {
        headers,
        method: 'GET',
        // then get the json
      }).then(async (response) => {
        // lets return the results where value = id, and text = email
        const data = await response.json()
        options = data.results.map((user) => {
          return {
            text: user.email,
            value: user.id,
          }
        })
        options.unshift({
          text: 'No One',
          value: '',
        })
        responseBody = {
          actionType: 'DROPDOWN_FETCH',
          response: {
            options,
            selectedOption: bot.hsUserId,
            placeholder: 'Pick a user',
          },
          message: null,
        }
      })
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody),
      }
    }
  }

  const isBotActive = event.path.indexOf('/hubspot/getActive') > -1
  if (isBotActive) {
    const responseBody = {
      actionType: 'TOGGLE_FETCH',
      response: {
        enabled: null,
      },
      message: null,
    }

    const body = event.body
    const parsedBody = JSON.parse(body) // this isn't working
    const params = {}
    for (const key in parsedBody) {
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
    const isActiveFetch = params.actionType === 'TOGGLE_FETCH'
    const isActiveUpdate = params.actionType === 'TOGGLE_UPDATE'
    console.log({
      status: 'isBotActive',
      actionType: params.actionType,
      isActiveFetch,
      isActiveUpdate,
    })
    if (isActiveFetch) {
      const bot = await db.bot.findFirst({
        where: { hsPortalId: params.portalId },
        select: {
          hsActive: true,
          title: true,
        },
      })
      responseBody.response.enabled = bot?.hsActive
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody),
      }
    }
    if (isActiveUpdate) {
      let bot = await db.bot.findFirst({
        where: { hsPortalId: params.portalId },
      })
      if (bot) {
        const data = {
          hsActive: params.enabled,
        }
        console.log({ data })
        bot = await db.bot.update({
          where: { id: bot.id },
          data,
        })
      }
      responseBody.response.enabled = params.enabled
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody),
      }
    }
  }

  const isBot = event.path.indexOf('/hubspot/bot/') > -1
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
    // sometimes the messageArr is an array of messages
    // and sometimes it is a single message
    if (messageArr.length === undefined) messageArr = [messageArr]
    messageArr.forEach(async (messageObj) => {
      // so lets comment this out how it will work
      // 1. visitor will send a message
      // 2. hubspot will log the message
      // 3. hubspot will send a webhook to our app
      // 4. we will get the webhook
      // 5. we will lookup the bot by the hubspot account id, if not found return error
      const bot = await db.bot.findFirst({
        where: { hsPortalId: messageObj.portalId },
      })
      //console.log({ bot })
      // is the bot active
      console.log({
        bot: {
          hsActive: bot.hsActive,
          hsUserId: bot.hsUserId,
          fixieCorpusId: bot.fixieCorpusId,
        },
      })
      if (!bot.hsActive) return
      // 6. define if this is a new conversation or a new message
      const isNewConversation =
        messageObj.subscriptionType === 'conversation.creation'
      const isNewMessage =
        messageObj.subscriptionType === 'conversation.newMessage'
      // okay handle new message handleNewMessage({messageObj})
      // 7. if new message, look up the thread by the threadId, if not found return error
      if (isNewMessage) {
        console.log('NEW MESSAGE')
        // we can do both these calls at the same time
        Promise.all([
          getThreadDetails({ bot, threadId: messageObj.objectId }),
          getThreadMessages({ bot, threadId: messageObj.objectId }),
        ]).then(async (values) => {
          const [threadDetails, lastThreeMessages] = values
          //console.log({ threadDetails, lastThreeMessages })
          // 8. define messages, and lastMessage
          // 8. define the assignedTo, assignedToNoOne(bool), assignedToAI(bool), and assignedToSomeoneElse(bool)
          // 8. define the from actor (https://developers.hubspot.com/docs/api/conversations/conversations#endpoint?spec=GET-/conversations/v3/conversations/actors/{actorId})
          const assignedTo = threadDetails.assignedTo
          const assignedToNoOne = typeof assignedTo === 'undefined'
          const assignedToAI = assignedTo === 'A-' + bot.hsUserId
          const lastMessageFrom = lastThreeMessages[0].actorId
          const lastMessageFromBot = lastMessageFrom === 'A-' + bot.hsUserId
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
            let chunks = await getFixieChunks({
              query: lastThreeMessages[0].text,
              fixieCorpusId: bot.fixieCorpusId,
            })
            /*console.log({
              chunks: chunks.map((chunk) => {
                return {
                  score: chunk.score,
                  chunkContentLength: chunk.chunkContent.length,
                  citationUrl: chunk.citation.publicUrl,
                  citationTitle: chunk.citation.title,
                }
              })
            })*/
            // lets only use chunks where the score is >= .75
            chunks = chunks.filter((chunk) => {
              return chunk.score >= 0.75
            })
            // if we have no chunks, then let's respond with a message
            if (chunks.length === 0) {
              /**send message */
            }
            const chunkString = chunks
              .map((chunk) => {
                return chunk.chunkContent
              })
              .join(' ')
            // lets get the hsPrompt
            let hsPrompt = JSON.parse(bot.hsPrompt)
            // hsPrompt is an array of objects { role: "system | assistant | user", content: "string" }
            // we need to replace the system's message's handlebars {{context}} with the chunk's content
            hsPrompt = hsPrompt.map((prompt) => {
              if (prompt.role === 'system') {
                prompt.content = prompt.content.replace(
                  '{{context}}',
                  chunkString
                )
              }
              return prompt
            })
            // lets call openAI
            const openAIResponse = await openAIRequest({
              message: lastThreeMessages[0].text,
              prompt: hsPrompt,
            })

            const sendData = {
              bot,
              message: openAIResponse,
              threadId: messageObj.objectId,
              channelId: lastThreeMessages[0].channelId,
              channelAccountId: lastThreeMessages[0].channelAccountId,
            }
            //console.log({ sendData })
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
  const STATE_FROM_URL = (() => {
    const state = event.queryStringParameters.state
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
