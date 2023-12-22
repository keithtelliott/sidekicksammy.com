// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'


export default async ({ args }) => {
  // Your script here...
  console.log(':: Executing script with args ::')
  console.log(args)
  let model = args['_'][1]
  let whereField = args['_'][2]
  let whereValue = args['_'][3]
  let updateField = args['_'][4]
  let updateValue = args['_'][5]
  let where = {}
  where[whereField] = whereValue
  let update = {}
  update[updateField] = updateValue
  if(!model || !whereField || !whereValue || !updateField || !updateValue) {
    console.log(':: Please provide model, whereField, whereValue, updateField, updateValue ::')
    return
  }
  await db[model].findFirst({where}).then((record) => {
    console.log(record)
    if(!record) {
      console.log(':: Record not found ::')
      return
    }
    db[model].update({
      where,
      data: update
    }).then((record) => {
      console.log(record)
    })
  }
  )
}
