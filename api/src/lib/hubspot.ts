
import fetch from 'cross-fetch'
import { slugify } from './text';
import { generateHexColor, inverseColor } from './color';
import { db } from './db';
export let getAllContact = async ({ after }: { after?: string }) => {
  console.log(`getAllContact: after: ${after}`)
  let contacts: any[] = [];
  let limit = 100;
  let archived = false;
  let properties = [
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
  ];
  let propertiesString = properties.join('&properties=');
  let afterString = '';
  if (after !== undefined) afterString = `&after=${after}`
  let url = [
    'https://api.hubapi.com/crm/v3/objects/contacts?',
    `limit=${limit}`,
    afterString,
    `&archived=${archived}`,
    `&properties=${propertiesString}`
  ];
  let joinedUrl = url.join('');
  const response = await fetch(joinedUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.SIDEKICKSAMMY_HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json();
  // push the results into the contacts array
  let results = data.results;
  contacts = contacts.concat(results);
  console.log(`getAllContact: contacts.length: ${contacts.length}`)
  return contacts;
}
// alias getHubspotContacts to getAllContact
export let getSocialProof = async () => {
  let allContacts = await getAllContact({ after: undefined });
  allContacts = allContacts.filter((contact) => {
    if (contact.properties.sidekick_title && contact.properties.sidekick_logo_url) {
      return true;
    }
    return false;
  })
  allContacts = allContacts.map((contact) => {
    let slugifiedSidekickTitle = slugify(contact.properties.sidekick_title || '');
    return {
      logo: contact.properties.sidekick_logo_url,
      title: contact.properties.sidekick_title,
      link: `/${slugifiedSidekickTitle}`
    }
  })
  return allContacts;
}
export let getContactBySidekickTitle = async ({ title }: { title: string }) => {
  let allContacts = await getAllContact({ after: undefined });
  let contact = allContacts.filter((contact) => {
    // we need to slugify the title and the sidekick_title
    let slugifiedSidekickTitle = slugify(contact.properties.sidekick_title || '');
    if (title == slugifiedSidekickTitle) {
      return true;
    }
    return false;
  })
  return contact[0];
}
export let mapHubspotContactToContact = ({ contact }: { contact: any }) => {
  let primaryColor = contact?.properties?.sidekick_color_primary || generateHexColor();
  let secondaryColor = contact?.properties?.sidekick_color_secondary || generateHexColor();
  let textColor = contact?.properties?.sidekick_color_text || generateHexColor();
  // lets send down the color scheme
  let colorScheme = {
    primaryColorScheme: { light: primaryColor, dark: inverseColor(primaryColor) },
    secondaryColorScheme: { light: secondaryColor, dark: inverseColor(secondaryColor) },
    textColorScheme: { light: textColor, dark: inverseColor(textColor) },
    logo: contact?.properties?.sidekick_logo_url || '',
  }

  // lets get the opposite of the primary color
  console.log('sidekick_fixie_agent_id: ' + contact?.properties?.sidekick_fixie_agent_id)
  console.log('sidekick_fixie_corpus_id: ' + contact?.properties?.sidekick_fixie_corpus_id)
  return {
    id: contact?.id,
    fixieCorpusId: contact?.properties.sidekick_fixie_corpus_id,
    fixieAgentId: contact?.properties.sidekick_fixie_agent_id,
    sidekickTitle: contact?.properties.sidekick_title,
    sidekickGreeting: contact?.properties.sidekick_greeting,
    sidekickColorScheme: JSON.stringify(colorScheme)
  }
}
export let respond = async ({ message, threadId, who }) => {
  console.log('from customer');
  // lets get the account, channel, and channelAccount
  let [account, channelId, channelAccountId, hubspotToken] = ['', '', '', ''];
  let thread = await db.thread.findUnique({
    where: {
      id: threadId
    },
    select: {
      Sidekick: {
        select: {
          hubspotAIAccountId: true,
          hubspotChannelId: true,
          hubspotChannelAccountId: true,
          hubspotToken: true
        }
      },
      }
  });
  if(thread) {
    [account, channelId, channelAccountId, hubspotToken] = [thread.Sidekick.hubspotAIAccountId, thread.Sidekick.hubspotChannelId, thread.Sidekick.hubspotChannelAccountId, thread.Sidekick.hubspotToken];
  }
  // eles
  let responseBody = {
    "type": "MESSAGE",
    "text": message,
    //"richText": "<p>Hey there, followiasdfng up</p>",
    //"richText": `<p>${message} RICH</p>`,
    "senderActorId": account,
    "channelId": channelId,
    "channelAccountId": channelAccountId,
    "subject": "Follow up"
  }
  let responseUrl = `https://api.hubspot.com/conversations/v3/conversations/threads/${threadId}/messages`;
  let responseOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${hubspotToken}` },
    body: JSON.stringify(responseBody)
  };
  let responseResponse = await fetch(responseUrl, responseOptions);
}
