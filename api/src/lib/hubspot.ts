import fetch from 'cross-fetch'

import { generateHexColor, inverseColor } from './color'
import { db } from './db'
import { slugify } from './text'
export const getAllContact = async ({ after }: { after?: string }) => {
  console.log(`getAllContact: after: ${after}`)
  let contacts: any[] = []
  const limit = 100
  const archived = false
  const properties = [
    'sidekick_color_primary',
    'sidekick_color_secondary',
    'sidekick_color_text',
    'sidekick_logo_url',
    'sidekick_fixie_corpus_id',
    'sidekick_fixie_agent_id',
    'sidekick_outcome',
    'sidekick_personality',
    'sidekick_title',
    'sidekick_greeting',
    'email',
    'id',
  ]
  const propertiesString = properties.join('&properties=')
  let afterString = ''
  if (after !== undefined) afterString = `&after=${after}`
  const url = [
    'https://api.hubapi.com/crm/v3/objects/contacts?',
    `limit=${limit}`,
    afterString,
    `&archived=${archived}`,
    `&properties=${propertiesString}`,
  ]
  const joinedUrl = url.join('')
  const response = await fetch(joinedUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.SIDEKICKSAMMY_HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  // push the results into the contacts array
  const results = data.results
  contacts = contacts.concat(results)
  console.log(`getAllContact: contacts.length: ${contacts.length}`)
  return contacts
}
// alias getHubspotContacts to getAllContact
export const getSocialProof = async () => {
  let allContacts = await getAllContact({ after: undefined })
  allContacts = allContacts.filter((contact) => {
    if (
      contact.properties.sidekick_title &&
      contact.properties.sidekick_logo_url
    ) {
      return true
    }
    return false
  })
  allContacts = allContacts.map((contact) => {
    const slugifiedSidekickTitle = slugify(
      contact.properties.sidekick_title || ''
    )
    return {
      logo: contact.properties.sidekick_logo_url,
      title: contact.properties.sidekick_title,
      link: `/${slugifiedSidekickTitle}`,
    }
  })
  return allContacts
}
export const getContactBySidekickTitle = async ({
  title,
}: {
  title: string
}) => {
  const allContacts = await getAllContact({ after: undefined })
  const contact = allContacts.filter((contact) => {
    // we need to slugify the title and the sidekick_title
    const slugifiedSidekickTitle = slugify(
      contact.properties.sidekick_title || ''
    )
    if (title == slugifiedSidekickTitle) {
      return true
    }
    return false
  })
  return contact[0]
}
export const mapHubspotContactToContact = ({ contact }: { contact: any }) => {
  const primaryColor =
    contact?.properties?.sidekick_color_primary || generateHexColor()
  const secondaryColor =
    contact?.properties?.sidekick_color_secondary || generateHexColor()
  const textColor =
    contact?.properties?.sidekick_color_text || generateHexColor()
  // lets send down the color scheme
  const colorScheme = {
    primaryColorScheme: {
      light: primaryColor,
      dark: inverseColor(primaryColor),
    },
    secondaryColorScheme: {
      light: secondaryColor,
      dark: inverseColor(secondaryColor),
    },
    textColorScheme: { light: textColor, dark: inverseColor(textColor) },
    logo: contact?.properties?.sidekick_logo_url || '',
  }

  // lets get the opposite of the primary color
  console.log(
    'sidekick_fixie_agent_id: ' + contact?.properties?.sidekick_fixie_agent_id
  )
  console.log(
    'sidekick_fixie_corpus_id: ' + contact?.properties?.sidekick_fixie_corpus_id
  )
  return {
    id: contact?.id,
    fixieCorpusId: contact?.properties.sidekick_fixie_corpus_id,
    fixieAgentId: contact?.properties.sidekick_fixie_agent_id,
    sidekickTitle: contact?.properties.sidekick_title,
    sidekickGreeting: contact?.properties.sidekick_greeting,
    sidekickColorScheme: JSON.stringify(colorScheme),
  }
}
