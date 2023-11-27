import type { APIGatewayEvent, Context } from 'aws-lambda'
import fetch from 'cross-fetch'
import Sitemapper from 'sitemapper'
import robotsParser from 'robots-parser'
import { logger } from 'src/lib/logger'
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
    try {
      let doc = new DOMParser({
        errorHandler: {
          warning: (w) => { },
          error: (e) => { },
          fatalError: (e) => { },
        },
      }).parseFromString(html, 'text/html')
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
      let pages = await getPagesFromSitemap(sitemap)
      if (pages.length > 0 && pages.length < 100) {
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
    return success({
      url: sitemapUrl,
      pagesCount: firstSitemap.length,
      first10Pages: firstSitemap.slice(0, 10),
    })
  }
  // if no sitemap, lets just make a manual one.
  let links = await getIndexPageAndLinks(url)
  if (links.length > 0) {
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
