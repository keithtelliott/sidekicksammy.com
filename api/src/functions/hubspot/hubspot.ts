import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'
const {
  HUBSPOT_CLIENT_ID,
  HUBSPOT_CLIENT_SECRET,
  HUBSPOT_CLIENT_SCOPES,
  URL,
  NODE_ENV
} = process.env
// next we need to define the oauthcallback url
const OAUTH_CALLBACK_URL = (() => {
  // if we are in dev mode we need to use localhost
  if (process.env.NODE_ENV === 'production' && process.env.URL) {
    return `https://${process.env.URL}/.redwood/functions/hubspot/oauth-callback`
  }
  return `http://localhost:8910/.redwood/functions/hubspot/oauth-callback`

})()
// next wee need to build the redirect url
const AUTH_URL = (() => {
  let scopes = HUBSPOT_CLIENT_SCOPES.split(',')
  //scopes need to be space delimited
  scopes = scopes.map(scope => scope.trim());
  let scopeString = scopes.join(' ')
  let url = 'https://app.hubspot.com/oauth/authorize'
  url += `?client_id=${HUBSPOT_CLIENT_ID}`
  url += `&scope=${scopeString}`
  url += `&redirect_uri=${OAUTH_CALLBACK_URL}`
  url += `&state=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
  return url
})()
const refreshTokenStore = {};
const exchangeForTokens = async (sessionId, proof) => {
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

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: hubspot function`)

  // exit early if no HUBSPOT_CLIENT_ID or HUBSPOT_CLIENT_SECRET
  if (!HUBSPOT_CLIENT_ID || !HUBSPOT_CLIENT_SECRET) {
    throw new Error('Hubspot Function - NO CLIENT ID OR SECRET')
  }
  // exit early if production and no url
  if (NODE_ENV === 'production' && !URL) {
    throw new Error('Hubspot Function - NO URL')
  }
  // exit early if no scopes
  if (!HUBSPOT_CLIENT_SCOPES) {
    throw new Error('Hubspot Function - NO SCOPES')
  }
  // determine if this is the oauth callback or install
  let isOauthCallback = event.path === '/hubspot/oauth-callback'
  if (isOauthCallback) {
    const { code, state } = event.queryStringParameters
    await handleOauthCallback({ code, sessionId: state })
  }
  // i'm going to add some more end points;
  // this one is goign to get a list of users from hubspot
  // to allow the user to select a user to act as the bot
  // first we need to identify if the call is for this function
  let isGetUsers = event.path === '/hubspot/users'
  if (isGetUsers) {
    
  }

  let html = `
    <html>
      <head>
        <title>Hubspot App</title>
      </head>
      <body>
        <h1>Hubspot App</h1>
        <p>Click the link below to go to the app</p>
        <a href="${AUTH_URL}">Install the App</a>
        <a href="/.redwood/functions/hubspot/">Start Over</a>
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
