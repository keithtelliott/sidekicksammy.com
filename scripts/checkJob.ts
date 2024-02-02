// To access your database
// Append api/* to import from api and web/* to import from web
import { checkLastJobStatus } from 'api/src/lib/fixie'

export default async ({ args }) => {
  // Your script here...
  console.log(':: Executing script with args ::')
  const corpus_id = 'a27ab52f-4642-4c9e-9323-58b0cad27205'
  const source_id = '01e9d584-b26e-4aae-b207-94c45afeaf9e'

  const job_status = await checkLastJobStatus({
    fixieCorpusId: corpus_id,
    sourceId: source_id,
  })
  //console.log({ job_status })
  // state, loadResult
  console.log({
    state: job_status.jobs[0].state,
    loadResult: job_status.jobs[0].loadResult,
  })
}
