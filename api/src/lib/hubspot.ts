
import fetch from 'cross-fetch'
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
  console.log(`getAllContact: contacts.length: ${contacts.length}`)
  return contacts;
}
// alias getHubspotContacts to getAllContact
export let getSocialProof2 = async ({count}) => {
  console.log("HERE I AM..................................................")
  return [{
    proof: "hello world" + count
  }]
}
export let getSocialProof = async () => {
  console.log(' RUNNING SOCIAL PROOF ' );
  let allContacts = await getAllContact({ after: undefined });
  allContacts = allContacts.filter((contact) => {
    if (contact.properties.sidekick_title && contact.properties.sidekick_logo_url) {
      return true;
    }
    return false;
  })
  allContacts = allContacts.map((contact) => {
    //console.log(contact.properties)
    // we need to slugify the link from title
    let slugifiedSidekickTitle = slugify(contact.properties.sidekick_title || '');
    return {
      logo: contact.properties.sidekick_logo_url,
      title: contact.properties.sidekick_title,
      link: `/${slugifiedSidekickTitle}`
    }
  })
  console.log(allContacts)
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
console.log( 'map contact', contact )
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
  return {
    id: contact?.id,
    fixieCorpusId: contact?.properties.sidekick_fixie_corpus_id,
    sidekickTitle: contact?.properties.sidekick_title,
    sidekickColorScheme: JSON.stringify(colorScheme)
  }
}
let slugify = (str: string) => {
  // lower case
  // strip out non alpha numeric characters
  // replace spaces with dashes
  let returnString = str.toLowerCase();
  returnString = returnString.replace(/[^a-z0-9 ]/g, "");
  returnString = returnString.replace(/\s+/g, '-');
  return returnString;

}
let generateHexColor = () => {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // sometimes this is returning a 4 digit hex, we need to make sure it's 6
  if (randomColor.length < 6) {
    randomColor = randomColor + '0'.repeat(6 - randomColor.length);
  }
  return `#${randomColor}`;
}
let getLuminance = (r: string, g: string, b: string) => {
  // convert rgb's to numbers
  let rn = Number(r);
  let gn = Number(g);
  let bn = Number(b);

  let a = [rn, gn, bn].map(function (v) {
    v /= 255;
    return (v <= 0.03928)
      ? v / 12.92
      : Math.pow(((v + 0.055) / 1.055), 2.4);
  });
  return Number((a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722).toFixed(3));
}
let getContrast = (rgb1: string, rgb2: string) => {
  //console.log(`rgb1: ${rgb1}, rgb2: ${rgb2}`)
  let [r1, g1, b1] = rgb1.replace(/[^\d,]/g, '').split(',')
  let [r2, g2, b2] = rgb2.replace(/[^\d,]/g, '').split(',')
  //console.log(`r1: ${r1}, g1: ${g1}, b1: ${b1}`)
  let lum1 = getLuminance(r1, g1, b1);
  let lum2 = getLuminance(r2, g2, b2);
  //console.log(`lum1: ${lum1}, lum2: ${lum2}`)
  let brightest = Math.max(lum1, lum2);
  let darkest = Math.min(lum1, lum2);
  //console.log(`brightest: ${brightest}, darkest: ${darkest}`)
  return (brightest + 0.05)
    / (darkest + 0.05);
}
let passesContrastCheck = (color1: string, color2: string) => {
  let contrast = getContrast(color1, color2);
  //console.log(`contrast between ${color1} and ${color2} is ${contrast}`)
  if (contrast > 4.5) {
    return true;
  }
  return false;
}
let convertColorToRgb = (color: string) => {
  let returnColor = '';
  let isHex = color.match(/^#([0-9a-f]{3}){1,2}$/i);
  let isRgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  let isRgba = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
  let isHsl = color.match(/^hsl\((\d+),\s*(\d+),\s*(\d+)\)$/);
  let isHsla = color.match(/^hsla\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
  //console.log({isHex, isRgb, isRgba, isHsl, isHsla})
  if (isHex) {
    // convert the hex to rgb
    let hex = color.substring(1);
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    returnColor = `rgb(${r}, ${g}, ${b})`;
  }
  if (isRgb) {
    returnColor = color;
  }
  if (isRgba) {
    // convert to rgb
    let r = isRgba[1];
    let g = isRgba[2];
    let b = isRgba[3];
    returnColor = `rgb(${r}, ${g}, ${b})`;
  }
  if (isHsl) {
    // convert to rgb
    let h = isHsl[1];
    let s = isHsl[2];
    let l = isHsl[3];
    returnColor = `rgb(${h}, ${s}, ${l})`;
  }
  if (isHsla) {
    // convert to rgb
    let h = isHsla[1];
    let s = isHsla[2];
    let l = isHsla[3];
    returnColor = `rgb(${h}, ${s}, ${l})`;
  }
  if (!isHex && !isRgb && !isRgba && !isHsl && !isHsla) {
    // return the color
    returnColor = color;
  }
  //console.log(`convertColorToRgb: ${color} => ${returnColor}`)
  return returnColor;
}
let inverseColor = (color: string) => {
  // color can be hex, rgb, rgba, hsl, hsla, or named color.level
  // in all cases we want to convert the color to rgb
  let returnColor = '';
  let isNamedColor = color.match(/^[a-z]+$/i);
  if (!isNamedColor) {
    returnColor = convertColorToRgb(color);
    // now invert the rgb
    let [r, g, b] = returnColor.replace(/[^\d,]/g, '').split(',')
    let rn = 255 - Number(r);
    let gn = 255 - Number(g);
    let bn = 255 - Number(b);
    returnColor = `rgb(${rn}, ${gn}, ${bn})`;

  }
  if (isNamedColor) {

    // named color is different, we're just going to flip the color
    // if the color is black, we'll return white
    // if the color is white, we'll return black
    // if the color is red, we'll return cyan
    // etc;
    // oclor is either 'red', or 'red.100', or 'red.200', etc
    let namedColor = color;
    if (namedColor.indexOf('.') > -1) {
      namedColor = namedColor.split('.')[0];
    }
    // if the color doesn't exist, we'll just return the current color
    let colorMap: any = {
      'black': 'white',
      'white': 'black',
      'red': 'cyan',
      'cyan': 'red',
      'blue': 'yellow',
      'yellow': 'blue',
      'magenta': 'green',
      'green': 'magenta',
    };
    let inverseNamedColor = colorMap[namedColor];
    if (inverseNamedColor) {
      returnColor = inverseNamedColor;
    } else {
      returnColor = color;
    }
  }
  //console.log(`inverseColor: ${color} => ${returnColor}`)
  return returnColor;
}
