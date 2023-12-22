// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'


export default async ({ args }) => {
  // Your script here...
  console.log(':: Executing script with args ::')
  console.log(args)
  let model = args['_'][1]
  let selectFields = args['_'][2]?.split(',') || []
  console.log(selectFields)
  if(selectFields.length > 0) {
    // selectFields needs to be [{field: true}, {field: true}]
    let select = {
      id: true
    }
    selectFields.forEach((field) => {
      select[field] = true
    })
    console.log({select})
    await db[model].findMany({
      select
    }).then((records) => {
      console.log(records)
    })
    return

  }
  await db[model].findMany().then((records) => {
    console.log(records)
  })
}
