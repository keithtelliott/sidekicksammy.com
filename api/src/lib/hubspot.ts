export let getAllContact = async ({ after }: { after?: string }) => {
  let contacts: any[] = [];
  let limit = 100;
  let archived = false;
  let properties = [
    'sidekick_color_scheme',
    'sidekick_fixie_corpus_id',
    'sidekick_outcome',
    'sidekick_personality',
    'sidekick_title',
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
  return contacts;
}
export let getContactBySidekickTitle = async ({ title }: { title: string }) => {
  let allContacts = await getAllContact({ after: undefined });
  let slugify = (str: string) => {
    // lower case
    // strip out non alpha numeric characters
    // replace spaces with dashes
    let returnString = str.toLowerCase();
    returnString = returnString.replace(/[^a-z0-9 ]/g, "");
    returnString = returnString.replace(/\s+/g, '-');
    return returnString;

  }
  let contact = allContacts.filter((contact) => {
    // we need to slugify the title and the sidekick_title
    let slugifiedSidekickTitle = slugify(contact.properties.sidekick_title || '');
    if(title == slugifiedSidekickTitle) {
      return true;
    }
    return false;
  })
  return contact[0];
}
export let mapHubspotContactToContact = ({contact}: {contact: any}) => {
  return {
    id: contact?.id,
    fixieCorpusId: contact?.properties.sidekick_fixie_corpus_id,
    sidekickTitle: contact?.properties.sidekick_title,
    sidekickColorScheme: contact?.properties.sidekick_color_scheme,

  }
}
