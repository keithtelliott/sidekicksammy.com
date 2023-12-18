import { db } from 'api/src/lib/db'
import { convertColorToHex } from 'api/src/lib/color'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import {getAllContact} from 'api/src/lib/hubspot'
let slugify = (text) => {
  // simple slugify function
  let slug = text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '')          // Trim - from end of text
  return slug;
}
export default async () => {
  try {
    const adminEmails = [
      "bruce.canedy@technologyplayground.com",
      "jace@benson.run",
      "keith.t.elliot@gmail.com"
    ]
    let contacts = await getAllContact({ after: undefined });
    // lets filter out the contacts that don't have a sidekick_title
    contacts = contacts.filter((contact) => {
      if (contact.properties.sidekick_title && contact.properties.email) {
        return true;
      }
      return false;
    })

    await Promise.all(
      adminEmails.map((email) => {
        // lets generate a random password 10 numbers long
        // we'll just reset it
        let password = Math.random().toString(36).slice(-10)
        const [hashedPassword, salt] = hashPassword(password)
        // look to see if the user exists
        return db.user.findFirst({ where: { email } }).then((user) => {
          // if the user exists, skip it
          // if the user doesn't exist, lets create the user
          if (!user) {
            return db.user.create({
              data: {
                email,
                hashedPassword,
                salt,
                name: email,
                roles: 'admin',
              },
            })
          }
        })
      })
    )
    // lets get all the contacts from hubspot
    // lets create a new user for each contact
    await Promise.all(
      contacts.map(async (contact) => {
        if(!contact.properties.email) return
        let userExists = await db.user.count({ where: { email: contact.properties?.email } }).then((count) => count > 0)
        if (userExists) {
          console.log({note: 'user already exists', email: contact.properties.email, title: contact.properties.sidekick_title, count: userExists})
          return
        }
        console.log({note: 'creating user', email: contact.properties?.email, title: contact.properties.sidekick_title})
        let email = contact.properties.email;
        let password = Math.random().toString(36).slice(-10)
        const [hashedPassword, salt] = hashPassword(password)
        return db.user.create({
          data: {
            email,
            hashedPassword,
            salt,
            name: contact.properties.sidekick_title,
            roles: 'customer',
          },
        })
      })
    )
    // lets create a new bot for each contact
    await Promise.all(
      contacts.map(async (contact) => {
        // if the bot exists, skip it
        console.log({contact})
        let botExists = await db.bot.findFirst({ where: { title: contact.properties?.sidekick_title } })
        if (botExists) {
          let modifiedData = {...botExists}
          delete modifiedData.id
          if(contact.properties.sidekick_title) {
            modifiedData.title = contact.properties.sidekick_title
            modifiedData.urlSlug = slugify(contact.properties.sidekick_title)
          }
          if(contact.properties.sidekick_greeting) {
            modifiedData.greeting = contact.properties.sidekick_greeting
          }
          if(contact.properties.sidekick_color_primary) {
            modifiedData.backgroundColor = convertColorToHex(contact.properties.sidekick_color_primary)
          }
          if(contact.properties.sidekick_color_text) {
            modifiedData.textColor = convertColorToHex(contact.properties.sidekick_color_text)
          }
          if(contact.properties.sidekick_logo_url) {
            modifiedData.logoUrl = contact.properties.sidekick_logo_url
          }
          if(contact.properties.sidekick_fixie_corpus_id) {
            modifiedData.fixieCorpusId = contact.properties.sidekick_fixie_corpus_id
          }
          if(contact.properties.sidekick_fixie_agent_id) {
            modifiedData.fixieAgentId = contact.properties.sidekick_fixie_agent_id
          }
          console.log({ modifiedData })
          return await db.bot.update({
            where: { id: botExists.id },
            data: modifiedData,
          })
        }
        let email = contact.properties.email;
        if(!email) throw new Error('Missing Email', contact)
        let urlSlug = slugify(contact.properties.sidekick_title || '')
        let userId = await db.user.findFirst({ where: { email } }).then((user) => user.id)
        // lets look for the bot
        return await db.bot.create({
          data: {
            hsPrompt: JSON.stringify([
              {
                role: "system",
                content: [
                  `You are an AI-powered chatbot named "${contact.properties.sidekick_title}".`,
                  `Your main function is to ${contact.properties.sidekick_outcome || "help find the perfect product and answer"}.`,
                  `Take on a personality of ${contact.properties.sidekick_personality || "jovial"}.`,
                  "When you are asked a question, you should respond with a short answer that is relevant to the question.",
                  "If that answer has a SOURCE, you should include that source in your response.",
                  "Answer in plain text, not HTML, not Markdown.",
                  "Answer should be short and concise, aim for 1-2 sentences.",
                  "Related Context: {{context}}"
                ].join('\n')
              },
              {
                role: "assistant",
                content: contact.properties.sidekick_greeting || `Hello, I'm ${contact.properties.sidekick_title}. I'm here to help you with any questions you may have. How can I help you?`
              },
            ]),
            hsUserId: parseInt(contact.id,10),
            greeting: contact.properties.sidekick_greeting || `Hello, I'm ${contact.properties.sidekick_title}. I'm here to help you with any questions you may have. How can I help you?`,
            backgroundColor: convertColorToHex(contact.properties.sidekick_color_primary),
            textColor: convertColorToHex(contact.properties.sidekick_color_text),
            fixieCorpusId: contact.properties.sidekick_fixie_corpus_id,
            fixieAgentId: contact.properties.sidekick_fixie_agent_id,
            urlSlug,
            userId,
            logoUrl: contact.properties.sidekick_logo_url,
          },
        })
      }
      )
    )

  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
