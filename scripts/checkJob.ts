import { checkLastJobStatus } from 'api/src/lib/fixie'

/**
 * Jace and Keith created this script to manually test the checkLastJobStatus function.
 *
 * The corpus_id and source_id are hard-coded.  These are associated with the FIXIE_API_KEY
 * that is defined in the .env file.
 *
 * Go-Do:  Gracefully handle invalid corpus_id and source_id.  At the moment, the script will
 * throw a non-helpful error message.
 *     KTE, 2/3/2024 Update:  This Go-Do is in progress.  I catch an error in the fetch and
 *     return an error object, which prevent error bubbling chaos.  But, I'd like to add
 *     some TypeScript to clarify what the objects look like that are returned... so that's
 *     my next chunk of the Go-Do that I'll tackle next...
 *
 * Go-Do:  Incorporate this status check into the CreateBot.tsx form.  The goal is to give the
 * user instant feedback on the status of the bot, immediately after submitting the chat setup
 * form.
 *
 * KTE, Feb. 2, 2024
 */
export default async ({ args }) => {
  console.log(
    ':: Executing checkJob script with hardcoded corpus_id and source_id'
  )
  // Adjust the following hardcoded corpus_id and source_id for your testing needs.
  //
  // Anchorage Dental Group corpus_id and source_id, that exist in Jace's personal Fixie account
  // const corpus_id = 'a27ab52f-4642-4c9e-9323-58b0cad27205'
  // const source_id = '01e9d584-b26e-4aae-b207-94c45afeaf9e'

  // Anchorage Dental Group corpus_id and source_id, that exist in Keith's personal Fixie account
  const corpus_id = '7a8a7763-e774-43fb-a00a-26fa5b4f1fef'
  const source_id = 'e9ae3f42-c100-4c5a-9ec8-0204cd238786'

  const job_status = await checkLastJobStatus({
    fixieCorpusId: corpus_id,
    sourceId: source_id,
  })
  console.log(
    'In checkJob test script, line 36, the job_status result follows:  ',
    {
      job_status,
    }
  )
  // console.log(
  //   'In checkJob test script, line 39, the job_status state and load result follow:  ',
  //   {
  //     state: job_status?.jobs[0]?.state,
  //     loadResult: job_status?.jobs[0]?.loadResult,
  //   }
  // )
}
