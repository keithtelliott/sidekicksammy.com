import type { APIGatewayEvent, Context } from 'aws-lambda'
import fetch from 'cross-fetch'
import Sitemapper from 'sitemapper'
import robotsParser from 'robots-parser'
import { logger } from 'src/lib/logger'
import { DOMParser } from '@xmldom/xmldom'
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'
const nhm = new NodeHtmlMarkdown({}, undefined, undefined)

let sortLinks = (links: string[]) => {
  // sort the links from shortest to longest
  links = links.sort((a, b) => {
    return a.length - b.length
  })
  return links
}
let trimLinks = (links: string[]) => {
  // some pages sometimes have preceding \r\n or \n and spaces followed by \r\n or \n
  // so lets remove those
  links = links.map((page) => {
    return page.trim()
  })
  return links
}
let sortAndTrimLinks = (links: string[]) => {
  links = sortLinks(links)
  links = trimLinks(links)
  return links
}
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
    links = sortAndTrimLinks(links)
    return links
  }
  return []

}
let returnAllowedPages = async (url: string, pages: string[]) => {
  let allowedPages = []
  await fetch(url + '/robots.txt', {
    method: 'GET',
  })
    .then(async (res) => {
      if (res.status === 200) {
        let robotContent = await res.text()
        let robots = await robotsParser(url + '/robots.txt', robotContent)
        for (let i = 0; i < pages.length; i++) {
          let page = pages[i]
          let allowed = robots.isAllowed(page)
          if (allowed) {
            allowedPages.push(page)
          }
        }
        return allowedPages
      }
      return []
    })
    .catch((err) => {
      return []
    })
  return allowedPages
}
let getSiteMapFromRobotsTxt = async (url: string) => {
  let robotContent = await fetch(url + '/robots.txt', {
    method: 'GET',
  })
    .then(async (res) => {
      if (res.status === 200) {
        let robotContent = await res.text()
        console.log('robotContent', robotContent)
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
  pages = sortAndTrimLinks(pages)
  // now lets remove any pages disallowed from robots.txt
  console.log({url})
  // url is not root, so lets get the root url
  let urlObject = new URL(url);
  let rootUrl = urlObject.protocol + '//' + urlObject.hostname
  if (urlObject.port) {
    rootUrl += ':' + urlObject.port
  }
  let allowedPages = await returnAllowedPages(rootUrl, pages)
  return allowedPages
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
  pages = sortAndTrimLinks(pages)
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
 /* let openAIRequest = async (text: string) => {
    let openAIUrl = 'https://api.openai.com/v1/chat/completions'
  let openAIOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        { role: 'system', content: `I am an experienced prompt designer specializing in creating effective prompts for topic-specific bots. With a deep understanding of various subjects and expert knowledge in bot design, I can provide concise and accurate information based on the given context. I strive to generate system prompts that effectively address user inquiries in the most efficient manner possible.`},
        { role: 'user', content: `As an expert prompt designer for topic specific bots, I need your assistance. Can you generate a system prompt for me?` },
        { role: 'system', content: `Certainly! I'm here to help you. Please provide me with the greeting and the home page information in markdown format.` },
        { role: 'user', content: `Greeting: """${greeting}""" Home Page: """${homePage}"""` },
      ],
      temperature: 0.9,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  }
  }*/
  let getSiteSummary = async (page: string) => {
    let html = ''
    await fetch(page, {
      method: 'GET',
      // lets follow redirects
      redirect: 'follow',
    })
      .then(async (res) => {
        if (res.status === 200) {
          html = await res.text()
        }
        return ''
      })
      .catch((err) => {
        return ''
      })
    if (html?.length > 0) {
      // use node-html-markdown to get the text
      let markdown = nhm.translate(html)
      // now lets get the word count
      let wordCount = markdown.split(' ').length
      // now lets get the character count
      let characterCount = markdown.length
      console.log({ wordCount, characterCount })
    }
  }

  let robotSitemap = await getSiteMapFromRobotsTxt(url)
  if (robotSitemap.length > 0) {
    for (let i = 0; i < robotSitemap.length; i++) {
      let sitemap = robotSitemap[i]
      let pages = await getPagesFromSitemap(sitemap)
      if (pages.length > 0) {
        return success({
          url: sitemap,
          type: 'robots',
          pagesCount: pages.length,
          first10Pages: pages.slice(0, 10),
        })
      }
    }
  }
  let sitemapUrl = url + '/sitemap.xml'
  let firstSitemap = await gettingSitemap(sitemapUrl)
  if (firstSitemap.length > 0) {
    return success({
      url: sitemapUrl,
      type: 'sitemap',
      pagesCount: firstSitemap.length,
      first10Pages: firstSitemap.slice(0, 10),
    })
  }
  // if no sitemap, lets just make a manual one.
  let links = await getIndexPageAndLinks(url)
  if (links.length > 0) {
    return success({
      url,
      type: 'manual',
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
