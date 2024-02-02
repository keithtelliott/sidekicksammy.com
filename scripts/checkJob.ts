import { checkLastJobStatus } from 'api/src/lib/fixie'

/**
 * Jace and Keith created this script to manually test the checkLastJobStatus function.
 *
 * The corpus_id and source_id are hard-coded.  These are associated with the FIXIE_API_KEY
 * that is defined in the .env file.
 *
 * Go-Do:  Gracefully handle invalid corpus_id and source_id.  At the moment, the script will
 * throw a non-helpful error message.
 *
 * Go-Do:  Incorporate this status check into the CreateBot.tsx form.  The goal is to give the
 * user instant feedback on the status of the bot, immediately after submitting the chat setup
 * form.
 *
 * KTE, Feb. 2, 2024
 */
export default async ({ args }) => {
  // Your script here...
  console.log(':: Executing script with args ::')
  const corpus_id = 'a27ab52f-4642-4c9e-9323-58b0cad27205'
  const source_id = '01e9d584-b26e-4aae-b207-94c45afeaf9e'

  const job_status = await checkLastJobStatus({
    fixieCorpusId: corpus_id,
    sourceId: source_id,
  })
  console.log({ job_status })
  // state, loadResult
  console.log({
    state: job_status.jobs[0].state,
    loadResult: job_status.jobs[0].loadResult,
  })
}
