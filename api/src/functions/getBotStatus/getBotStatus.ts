import type { APIGatewayEvent, Context } from 'aws-lambda'

import { checkLastJobStatus } from 'src/lib/fixie'
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
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: getBotStatus function`)

  // we'll get the source and corpus id from the request
  // then we'll check the status of the last job
  const fixieCorpusId = event.queryStringParameters?.corpusId
  const sourceId = event.queryStringParameters?.sourceId

  if (!fixieCorpusId || !sourceId) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Missing corpusId or sourceId',
      }),
    }
  }
  const returnObject = await checkLastJobStatus({
    fixieCorpusId,
    sourceId,
  })
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(returnObject),
  }
}
