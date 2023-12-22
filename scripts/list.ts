// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'


export default async ({ args }) => {
  // Your script here...
  console.log(':: Executing script with args ::')
  console.log(args)
  let model = args['_'][1]
  await db[model].findMany({}).then((users) => {
    console.log(users)
  }
  )
}
