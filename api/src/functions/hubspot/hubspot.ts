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
if(!HUBSPOT_CLIENT_SCOPES) throw new Error('NO HUBSPOT_CLIENT_SCOPES')
if(HUBSPOT_CLIENT_SCOPES.indexOf(',') === -1) throw new Error('HUBSPOT_CLIENT_SCOPES NEEDS TO BE COMMA DELIMITED')
if(HUBSPOT_CLIENT_SCOPES) SCOEPSTRING = convertCommaSeparatedToSpaceDelimited(HUBSPOT_CLIENT_SCOPES)
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
  console.log({ tokens })
  // lets store the refresh token in the database
  /**
   * let decodedState = decrypt(sessionId)
  console.log({ decodedState })
  let parsedState = JSON.parse(decodedState)
  console.log({ parsedState })
  let customerId = parsedState.state
  if(!customerId) throw new Error('Missing Proper State')

   */
  let decodedState = decrypt(sessionId)
  console.log({ decodedState })
  let parsedState = JSON.parse(decodedState)
  console.log({ parsedState })
  let accountId = parsedState.state
  if(!accountId) throw new Error('Missing Proper State')
  // lets store the refresh token in the database
let expiresAt = new Date()
expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in)
  let hubspotBot = await db.hubspotBot.findFirst({where: {customerId}})
  if(!hubspotBot) {
    hubspotBot = await db.hubspotBot.create({
      data: {
        accountId,
        refreshToken: tokens.refresh_token,
        refreshTokenExpiresAt: expiresAt
      }
    })
  }
  if(hubspotBot) {
    hubspotBot = await db.hubspotBot.update({
      where: {id: hubspotBot.id},
      data: {
        refreshToken: tokens.refresh_token,
        refreshTokenExpiresAt: expiresAt
      }
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
    try{
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
  // if endpoint is /hubspot/bot/:slug
  // return json of all users
  let isBot = event.path.indexOf('/hubspot/bot/') > -1
  if(isBot) {
    let slug = event.path.split('/hubspot/bot/')[1]
    let account = await db.account.findFirst({where: {urlSlug: slug}})
    if(!account) return returnHtml(`<p>Account Not Found</p>`)
    let hubspotBot = await db.hubspotBot.findFirst({where: {customerId: customer.id}})
    if(!hubspotBot) return returnHtml(`<p>Bot Not Found</p>`)
    return returnHtml(`
      <p>Bot</p>
      <details>
      <summary>Tech Details</summary>
      <pre
        style="background: #eee; padding: 20px; border-radius: 5px;"
      >${JSON.stringify(hubspotBot, null, 2)}</pre>
      </details>
    `)
  }
  let STATE_FROM_URL = (() => {
    let state = event.queryStringParameters.state
    if (!state) {
      return null
    }
    return state
  })()
  return returnHtml(`
    <a href="${generateAuthUrl({state: STATE_FROM_URL})}">Install App</a>
    <p>${STATE_FROM_URL}</p>
    <p>${encrypt(STATE_FROM_URL)}</p>
  `)
}
