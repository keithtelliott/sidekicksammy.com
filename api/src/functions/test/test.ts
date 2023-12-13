import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */

const getTokens = async () => {
  const CLIENT_ID = '8c2574e8-6de5-4d44-9bdd-b570d9224efc'
  const CLIENT_SECRET = '60ff61b4-98d2-4f28-9341-a66a2ca41260'
  const REDIRECT_URI = 'http://localhost:8910/.redwood/functions/hubspot/oauth-callback'
  const ACCESS_TOKEN = '6d6e04ed-44db-4e84-9aff-2610414c3f8d'

  const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      refresh_token: ACCESS_TOKEN
    })
  });

  // Parse the response
  const data = await response.json();

  // Log the response to the console
  console.log(data);
  return data
}
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: test function`)
  let tokens = await getTokens()
  console.log({ tokens })
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: tokens,
    }),
  }
}
