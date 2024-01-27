import type { APIGatewayEvent, Context } from 'aws-lambda'

import { db } from 'src/lib/db'
//import { getAllContact } from 'src/lib/hubspot'
import { getSourcesByFixieCorpusId, refreshSource } from 'src/lib/fixie'
import { logger } from 'src/lib/logger'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: refreshCorpuses function`)
  const returnObject = {}
  const bots = await db.bot.findMany({
    where: {
      fixieCorpusId: { not: null },
    },
    select: {
      title: true,
      fixieCorpusId: true,
    },
  })
  // lets loop over each bot and ...
  // get the sources for each corpusId
  // then refresh each source if older than 1 day
  const botsRefreshed = []
  await Promise.all(
    bots.map(async (bot) => {
      const sources = await getSourcesByFixieCorpusId({
        fixieCorpusId: bot.fixieCorpusId,
      })
      if (!sources) {
        console.log(`source invalid for contact: ${bot.title}`)
        return
      }
      returnObject[bot.title] = {
        corpusId: bot.fixieCorpusId,
        sources,
      }
      // oaky so lets loop over the returnObject and get the sources for each corpusId
      sources.forEach(async (source) => {
        const isWeb = source?.loadSpec?.web ? true : false
        const lastUpdated = source?.stats?.lastUpdated
          ? new Date(source.stats.lastUpdated)
          : undefined
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const isReadyToRefresh = lastUpdated < yesterday
        if (isWeb && isReadyToRefresh) {
          await refreshSource({
            fixieCorpusId: source.corpusId,
            sourceId: source.sourceId,
          })
          botsRefreshed.push({ botTitle: bot.title, sourceId: source.sourceId })
        } else {
          console.log(`source is not web or is not ready to refresh`)
        }
      })
    })
  )
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'success',
      botsRefreshed,
    }),
  }
}
