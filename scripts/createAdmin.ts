// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'

export default async ({ args }) => {
  // Your script here...
  console.log(':: Executing script with args ::')
  console.log(args)
  let email = args['_'][1]
  let password = args['_'][2]
  if(!email || !password) {
    console.log(':: Please provide email and password ::')
    return
  }
  const [hashedPassword, salt] = hashPassword(password)
  let upsert = await db.user.upsert({
    where: { email },
    create: {
      email: email,
      name: email,
      roles: 'admin',
      hashedPassword: hashedPassword,
      salt: salt,
    },
    update: {
      name: email,
      roles: 'admin',
      hashedPassword: hashedPassword,
      salt: salt,
    },
  })
  console.log(upsert)
}
