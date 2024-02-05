import fetch from 'cross-fetch'

import {
  getContactBySidekickTitle,
  mapHubspotContactToContact,
} from './hubspot'

type JobObject = {
  corpusId: string
  sourceId: string
  state: 'JOB_STATE_COMPLETED' | string
  loadResult: {
    maxDocuments: number
  }
}

type JobStatusObject = {
  jobs: JobObject[]
  pageInfo: {
    requestedPageSize: number
    totalResultCount: number
    requestedOffset: number
  }
}

type ErrorObject = {
  error: string
}

export const getFixieChunks = async ({ message, sideKickTitle }) => {
  // the way this works, is we need the fixie, corpus id;
  // this data is stored in the hubspot contact
  // let assume we'll ahve a getContactBySidekickTitle
  const contact = await getContactBySidekickTitle({ title: sideKickTitle })
  const mappedContact = mapHubspotContactToContact({ contact })
  // mappedContact has the fixieCorpusId
  // now we can get the fixieChunks
  const fixieBody = {
    corpusId: mappedContact.fixieCorpusId,
    query: message,
    maxChunks: 3,
    rerankResults: 'RERANK_RESULTS_UNSPECIFIED',
  }
  const fixieOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIXIE_API_KEY}`,
    },
    body: JSON.stringify(fixieBody),
  }
  const fixieUrl = `https://api.fixie.ai/api/v1/corpora/${mappedContact.fixieCorpusId}/query`
  const response = await fetch(fixieUrl, fixieOptions)
  const data = await response.json()
  /**
  [
    {
      chunkContent: string,
      score: number, (0.0 - 1.0) (1.0 is best)
      citation: {
        sourceId: string,
        documentId: string,
        publicUrl: string,
        title: string
      }
    },
    { ... }
  ]
   */
  return data.results
}
// Great!
// the other thing we need is a way to get the messages,
// that's handled on hubspot's api today... but maybe we should store that in our own db?
export const getSourcesByFixieCorpusId = async ({ fixieCorpusId }) => {
  const fixieOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIXIE_API_KEY}`,
    },
    //body: JSON.stringify(fixieBody)
  }
  const fixieUrl = `https://api.fixie.ai/api/v1/corpora/${fixieCorpusId}/sources`
  const response = await fetch(fixieUrl, fixieOptions)
  const data = await response.json()
  //console.log(`getSourcesByFixieCorpusId: data: ${JSON.stringify(data)}`)
  return data.sources
}

export const refreshSource = async ({ fixieCorpusId, sourceId }) => {
  const fixieBody = {
    corpusId: fixieCorpusId,
    sourceId: sourceId,
  }
  const fixieOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIXIE_API_KEY}`,
    },
    body: JSON.stringify(fixieBody),
  }
  const fixieUrl = `https://api.fixie.ai/api/v1/corpora/${fixieCorpusId}/sources/${sourceId}/refresh`
  const response = await fetch(fixieUrl, fixieOptions)
  const data = await response.json()
  return data
}

export const checkLastJobStatus = async ({
  fixieCorpusId,
  sourceId,
}): Promise<
  JobStatusObject | ErrorObject | { detail: string } | ['Invalid corpus ID.']
> => {
  const fixieOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIXIE_API_KEY}`,
    },
  }
  const fixieUrl = `https://api.fixie.ai/api/v1/corpora/${fixieCorpusId}/sources/${sourceId}/jobs`
  try {
    const response = await fetch(fixieUrl, fixieOptions)
    return await response.json()
  } catch (e) {
    return { error: e }
  }
}
