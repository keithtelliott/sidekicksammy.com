import type { APIGatewayEvent, Context } from 'aws-lambda'
import { getAllContact } from 'src/lib/hubspot'
import { getSourcesByFixieCorpusId, refreshSource } from 'src/lib/fixie'
import { logger } from 'src/lib/logger'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: refreshCorpuses function`)
  let allContacts = await getAllContact({ after: undefined })
  // filter out all contacts without a sidekick_fixie_corpus_id
  allContacts = allContacts.filter((contact) => {
    if (contact.properties.sidekick_fixie_corpus_id) {
      return true
    }
    return false
  })
  allContacts = allContacts.map((contact) => {
    return {
      fixieCorpusId: contact.properties.sidekick_fixie_corpus_id,
      fixieAgentId: contact.properties.sidekick_fixie_agent_id,
      sidekickTitle: contact.properties.sidekick_title,
    }
  })
 let returnObject = {}
  for (let contact of allContacts) {
    let sources = await getSourcesByFixieCorpusId({ fixieCorpusId: contact.fixieCorpusId })
    if(!sources) {
      console.log(`source invalid for contact: ${contact.sidekickTitle}`)
      continue
    }
    returnObject[contact.sidekickTitle] = {
      corpusId: contact.fixieCorpusId,
      agentId: contact.fixieAgentId,
      sources
    }
  }
  // oaky so lets loop over the returnObject and get the sources for each corpusId
  for (let customer in returnObject) {
    console.log(`customer: ${customer}`)
    let sources = returnObject[customer].sources
    // check if we need to refresh each source if older than 1 day
    sources.forEach(async (source) => {
      let isWeb = source?.loadSpec?.web ? true : false
      let lastUpdated = source?.stats?.lastUpdated ? new Date(source.stats.lastUpdated) : undefined
      let yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      let isReadyToRefresh = lastUpdated < yesterday
      if(isWeb && isReadyToRefresh) {
        await refreshSource({ fixieCorpusId: source.corpusId, sourceId: source.sourceId })
      } else {
        console.log(`source is not web or is not ready to refresh`)
      }
    })

  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: "success"
    }),
  }
}
