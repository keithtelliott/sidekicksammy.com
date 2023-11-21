import type { APIGatewayEvent, Context } from 'aws-lambda'
import fetch from 'cross-fetch'
import Sitemapper from 'sitemapper'
import robotsParser from 'robots-parser'
import { logger } from 'src/lib/logger'
import metascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperTitle from 'metascraper-title'
import { DOMParser } from '@xmldom/xmldom'
/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
let getIndexPageAndLinks = async (url: string) => {
  // the output of this should a list of links
  let links = [url];
  // get the index page
  let html = await fetch(url, {
    method: 'GET',
    // lets follow redirects
    redirect: 'follow',
  })
    .then(async (res) => {
      //console.log('res', res)
      if (res.status === 200) {
        let html = await res.text()
        return html
      }
      return ''
    })
    .catch((err) => {
      return ''
    })
  if (html?.length > 0) {
    // make a dom
    console.log(html)
    try {
      let doc = new DOMParser({
        errorHandler: {
          warning: (w) => { },
          error: (e) => { },
          fatalError: (e) => { },
        },
      }).parseFromString(html, 'text/html')
      //console.log(doc)
      // get all the links
      let allLinks = doc.getElementsByTagName('a')
      console.log({ allLinksLength: allLinks.length })
      //let print the attributes
      for (let i = 0; i < allLinks.length; i++) {
        let link = allLinks[i]
        let href = link.getAttribute('href')
        if (href && href.startsWith('http')) {
          links.push(href)
        }
      }
    } catch (e) {
    }
    // it seems like the element
    links = [...new Set(links)]
    return links
  }
  return []

}
let getSiteMapFromRobotsTxt = async (url: string) => {
  let robotContent = await fetch(url + '/robots.txt', {
    method: 'GET',
  })
    .then(async (res) => {
      if (res.status === 200) {
        let robotContent = await res.text()
        //console.log('robotContent', robotContent)
        let robots = await robotsParser(url + '/robots.txt', robotContent)
        let sitemap = robots.getSitemaps()
        if (sitemap) {
          return sitemap
        }
        return []
      }
      return []
    })
    .catch((err) => {
      return []
    })
  return robotContent

}
let getPagesFromSitemap = async (url: string) => {
  const sitemapper = new Sitemapper({})
  sitemapper.timeout = 5000
  let pages = []
  await sitemapper.fetch(url).then((data) => {
    data.sites.forEach((site) => {
      pages.push(site)
    }
    )
  })
  return pages
}
let gettingSitemap = async (url: string) => {
  let pages = []
  const sitemapper = new Sitemapper({})
  sitemapper.timeout = 5000
  await sitemapper.fetch(url).then((data) => {
    data.sites.forEach((site) => {
      pages.push(site)
    })
  })
  return pages
}
let askOpenAI = async (text: string) => {
  let key = process.env.OPENAI_API_KEY
  if (!key) return ''
  // use fetch
  // use chatgpt-3.5-turbo
  let body = {
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      { role: "system", content: "Identify the one single outcome this document is trying convey.  This should make a promise, have an actionword, and either directly stated 'you' or 'imply you' meaning, that you're talking to the person reading this outcome" },
      { role: "user", content: `{ description: 'A site for my notes on ServiceNow', title: 'jace.pro' }` },
      { role: "assistant", content: "Learn something new about ServiceNow" },
      {
        role: "user", content: `{
        description: 'GlideFast Consulting is an Elite ServiceNow Partner who delivers expert solutions in implementing, integrating, and managing the ServiceNow platform.',
        title: 'ServiceNow Elite Partner | GlideFast Consulting | United States'
      }`},
      { role: "assistant", content: "Work with the best ServiceNow partner" },
      {
        role: "user", content: `{
        description: 'Cut costs and boost efficiency with Checklist Pro. Eliminate unnecessary customizations, enhance transparency, and improve end-user adoption. Free your customers from the cost of ServiceNow with our simple pricing. Try it now!',
        title: 'Boost Efficiency, Cut Costs | Checklist Pro'
      }`},
      { role: "assistant", content: "Save yourself some serious ServiceNow money" },
      {
        role: "user", content: `{
        description: 'A Dev/Sec/Ops and ServiceNow Blog',
        title: 'A Dev/Sec/Ops and ServiceNow Blog'
      }`},
      { role: "assistant", content: "Discover new ways to use ServiceNow" },
      { role: "user", content: `{ description: null, title: 'Skinny Raven Sports | Anchorage, Alaska' }` },
      { role: "assistant", content: "Get your gear at Skinny Raven" },
      { role: "user", content: text },
    ]
  }
  const url = 'https://api.openai.com/v1/chat/completions';
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body)
  }
  let response = await fetch(url, options)
    .then(async (res) => {
      if (res.status === 200) {
        let json = await res.json()
        return json
      }
      return ''
    })
    .catch((err) => {
      return ''
    })
  return response.choices[0].message
}
let guessOutcomes = async (url: string) => {
  // we're going to make a openai call
  // html to markdown converter for their homepage
  let html = await fetch(url, {
    method: 'GET',
  })
    .then(async (res) => {
      if (res.status === 200) {
        let html = await res.text()
        return html
      }
      return ''
    })
    .catch((err) => {
      return ''
    })
  if (html) {
    const metadata = await metascraper([
      metascraperDescription(),
      metascraperTitle(),
    ])({ html, url })
    console.log(metadata)
    //ask openai
    let openaiResponse = await askOpenAI(JSON.stringify(metadata))
    console.log(openaiResponse)
    return openaiResponse.content
  }
}
let success = (data: any) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
    }),
  }
}
let error = (data: any) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
    }),
  }
}
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: getPages function`)
  let url = event.queryStringParameters?.website
  if (!url) return error('Missing url parameter')
  if (!url.startsWith('http')) url = `https://${url}`
  if (url?.endsWith('/')) url = url.slice(0, -1)
  // lets validate the url is a valid url
  let urlObject = new URL(url);
  if (!urlObject) return error('Invalid url')
  // the urlObject hasa hostname, if the hostname
  // is has no tld, then error
  let hostname = urlObject.hostname
  let hostnameParts = hostname.split('.')
  if (hostnameParts.length < 2) return error('Invalid url')

  let robotSitemap = await getSiteMapFromRobotsTxt(url)
  if (robotSitemap.length > 0) {
    for (let i = 0; i < robotSitemap.length; i++) {
      let sitemap = robotSitemap[i]
      console.log('trying sitemap', sitemap)
      let pages = await getPagesFromSitemap(sitemap)
      if (pages.length > 0 && pages.length < 100) {
        console.log(' Robot Sitemap success')
        return success({
          url: sitemap,
          pagesCount: pages.length,
          first10Pages: pages.slice(0, 10),
        })
      }
      if (pages.length > 300) {
        let prettyPageLength = pages.length.toLocaleString()
        return error(`Many pages(${prettyPageLength}) found`);
      }
    }
  }
  let sitemapUrl = url + '/sitemap.xml'
  let firstSitemap = await gettingSitemap(sitemapUrl)
  if (firstSitemap.length > 0) {
    console.log(' Manual Sitemap success')
    return success({
      url: sitemapUrl,
      pagesCount: firstSitemap.length,
      first10Pages: firstSitemap.slice(0, 10),
    })
  }
  // if no sitemap, lets just make a manual one.
  let links = await getIndexPageAndLinks(url)
  if (links.length > 0) {
    console.log(' Index success')
    return success({
      url,
      pagesCount: links.length,
      first10Pages: links.slice(0, 10),
    })
  }
  if(links.length === 0) {
    return error('No links found')
  }
  // if we get here, we didn't find a sitemap
  return error('No sitemap found')
}
