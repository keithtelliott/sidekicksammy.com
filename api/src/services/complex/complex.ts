import type {
  QueryResolvers,
  MutationResolvers,
} from 'types/graphql'
import fetch from 'cross-fetch'
import { db } from 'src/lib/db'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import { slugify } from 'src/lib/text'
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'
const nhm = new NodeHtmlMarkdown({}, undefined, undefined)

let parsedUrl = (url) => {
  // if url does not start with https://
  // add it
  if (!url.startsWith('https://')) {
    url = 'https://' + url
  }
  return new URL(url)
}
const createCorpus = async (input) => {
  let url = 'https://api.fixie.ai/api/v1/corpora'
  let token = 'Bearer ' + process.env.FIXIE_API_KEY
  let data = {
    corpus: {
      displayName: input.url,
      description: input.url,
      public: false,
      //      jobCallbacks: [
      //        {
      //          stateFilter: [
      //            "JOB_STATE_COMPLETED",
      //            "JOB_STATE_FAILED",
      //          ],
      //          email: {
      //            to: [
      //              {
      //                name: process.env.FIXIE_NAME || "Sammy",
      //                email: process.env.FIXIE_EMAIL || "someone@example.com"
      //              }
      //            ]
      //          },
      //        }
      //      ]
    },
  }
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data)
  }
  let response = await fetch(url, options)
  let json = await response.json()
  return json
}
let fixieHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + process.env.FIXIE_API_KEY,
  }
}

const randomString = (length: number) => {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength))
  }
  return result
}
let createFixieSource = async (input) => {
  let url = `https://api.fixie.ai/api/v1/corpora/${input.corpusId}/sources`
  let token = 'Bearer ' + process.env.FIXIE_API_KEY
  let data = {
    corpusId: input.corpusId,
    source: {
      corpus_id: input.corpusId,
      displayName: input.url,
      description: input.url,
      load_spec: {
        web: {
          start_urls: [
            parsedUrl(input.url)
          ],
          maxDepth: input?.depth || "0",
          include_glob_patterns: [
            `${parsedUrl(input.url)}/**`
          ],
        }
      }
    }
  }
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data)
  }
  console.log({ options })
  let response = await fetch(url, options)
  let json = await response.json()
  return json
}
let createFixieAgent = async (input) => {
  let url = `https://console.fixie.ai/graphql`
  let operationName = "CreateDefaultRuntimeAgent"
  let variables = {
    displayName: input.url,
    description: input.url,
    defaultRuntimeParameters: JSON.stringify({ "corpusId": input.corpusId, "systemPrompt": input.prompt }),
    handle: slugify(input.url) + '-' + randomString(5),
  }
  let query = "mutation CreateDefaultRuntimeAgent($handle: String!, $displayName: String!, $defaultRuntimeParameters: JSONString!, $description: String!, $teamId: String) {\n  createAgent(\n    agentData: {handle: $handle, teamId: $teamId, name: $displayName, revision: {defaultRuntimeParameters: $defaultRuntimeParameters}, description: $description, published: true}\n  ) {\n    agent {\n      uuid\n      __typename\n    }\n    __typename\n  }\n}"
  let options = {
    method: 'POST',
    headers: fixieHeaders(),
    body: JSON.stringify({
      operationName: operationName,
      variables: variables,
      query: query
    })
  }
  console.log({ options })
  let response = await fetch(url, options)
  let json = await response.json()
  return json
}
let createUserOrFindExisting = async (input) => {
  const [hashedPassword, salt] = hashPassword(randomString(10))
  // create the user
  console.log({ input })
  let user = await db.user.findUnique({
    where: {
      email: input.email,
    },
  })
  if (!user) {
    user = await db.user.create({
      data: {
        email: input.email,
        roles: 'customer',
        hashedPassword: hashedPassword,
        salt: salt,
      },
    })
  }
  if (!user) throw new Error('Could not create user')
  return user
}
let isSlugUnique = async (slug) => {
  let lookupBot = await db.bot.findFirst({
    where: {
      urlSlug: slug,
    },
  })
  if (lookupBot) {
    return false
  }
  return true
}
let generatePrompt = async (url, greeting, outcome) => {
  // download the page html
  let response = await fetch(url)
  let html = await response.text()
  // convert to markdown
  let markdown = nhm.translate(html)
  // now lets ask openai to generate a prompt for us
  // first the messages array

  let customerSupportExample = [
    {
      role: 'user', content: `Outcome: """Customer Support"""
    Greeting: """Hi, I'm Sammy! I'm here to help you with your questions."""
    Home Page: """

    Order Contact Lenses
    Call Now:
    (907) 770-6652
    Request An Appointment
    OUR STORY
    * [Meet the doctors](/meet-our-providers)
    SERVICES
    EYEWEAR
    TECHNOLOGY
    PATIENT CENTER
    CONTACT US
    * [Contact Us](/contact-us)
    SHOP

    PROVIDING HIGH QUALITY COMPREHENSIVE EYE CARE
    REQUEST AN APPOINTMENT
    MAKAR EYECARE
    DIFFERENCE
    It is our mission to provide the highest quality health care and educate individuals regarding their eye care needs and visual status. Our patients can expect access to the most current surgical, medical, and optical technologies while being served by highly trained and friendly professionals in a clean, efficient and comfortable environment.

    We strive to exceed standards of care, placing emphasis on comprehensive services that enhance and preserve the visual system, whole-body health, and quality of life.

    —
    Dr Anthony & Dr Rebecca Makar, 1998
    LEARN MORE
    SUCCESS STORIES
    “ A friend needed me to accompany her to Makar Eyecare this past week and I was very impressed. The staff was professional and accommodating and the facility was lovely. The comfortable waiting area included a great space for kids...”
    PENELOPE
    READ MORE
    stucco
    calendar
    ANNOUNCEMENTS
    SOLSTICE SUNGLASS SALE
    ANNOUNCEMENTS
    SOLSTICE SUNGLASS SALE
    50% off the top brands in the world, ONE DAY ONLY. June 18th, 2021 1PM - 8PM
    stucco
    eye examsEYE EXAMS
    Contact LensesCONTACT LENSES
    OpticalEYEWEAR
    ocular disease managementOCULAR DISEASE MANAGEMENT
    low vision eyecareLOW VISION EYECARE
    surgerySURGERY
    MEET THE
    DOCTORS
    Dr. Anthony J. Makar
    Dr. Anthony J. Makar
    LEARN MORE

    Dr. Rebecca J. Makar
    LEARN MORE
    Dr. Elizabeth J. Lane
    Dr. Elizabeth Lane (Bow)
    LEARN MORE
    Dr. Alyxandria A. Morey
    Dr. Alyxandria A. Danger
    LEARN MORE
    Dr. Rowena Rivera
    Dr. Rowena Rivera-Garcia
    LEARN MORE
    Dr. Blair Lonsberry
    Dr. Blair Lonsberry
    LEARN MORE
    Dr. Tanner Wentzien
    Dr. Tanner Wentzien
    LEARN MORE
    Dr. Adam Clark
    Dr. Adam Clark
    LEARN MORE
    Dr. Adam Clark
    Dr. Scott Habermann
    LEARN MORE
    Dr. Bethany Becker
    Dr. Bethany Becker
    LEARN MORE
    OUR
    COLLECTIONS
    gucci
    jimmy choo
    kate spade
    ray ban
    gucci
    jimmy choo
    kate spade
    ray ban
    gucci
    jimmy choo
    kate spade
    ray ban
    VIEW COLLECTIONS
    FOLLOW US ON
    INSTAGRAM
    @MAKAREYECARE
    Photo from @makareyecare on Instagram on makareyecare at 5/11/21 at 6:18PM
    Photo from @makareyecare on Instagram on makareyecare at 4/26/21 at 7:33PM
    Embed Social Media Feeds on your website with Juicer!
    Photo from @makareyecare on Instagram on makareyecare at 3/31/21 at 12:35PM
    Photo from @makareyecare on Instagram on makareyecare at 5/6/21 at 4:23PM
    Photo from @makareyecare on Instagram on makareyecare at 4/22/21 at 11:36AM
    Photo from @makareyecare on Instagram on makareyecare at 4/11/21 at 1:03PM
    Photo from @makareyecare on Instagram on makareyecare at 5/1/21 at 12:09PM
    Photo from @makareyecare on Instagram on makareyecare at 4/16/21 at 3:12PM
    Photo from @makareyecare on Instagram on makareyecare at 4/5/21 at 12:38PM

    GET IN TOUCH
    If you have any questions or would like to inquire about our services, please fill out the form below.

    Name
    Email *
    Phone *
    Message

    SUBMIT


    MAIN
    Eyewear
    Advanced Technology
    Payment Options
    Patient Forms
    Testimonials
    OUR SERVICES
    Comprehensive Eye Exam
    Contact Lenses
    Designer Eyewear
    Ocular Disease Management
    Surgery Co-Management
    Low-Vision
    CONTACT INFO
    Address:
    341 W. Tudor Rd., Suite 101
    Anchorage, AK 99503
    GET DIRECTIONS
    Phone: (907) 770-6652
    Fax: (907) 770-3668
    HOURS
    Monday 8:00am - 6:00pm
    Tuesday 8:00am - 6:00pm
    Wednesday 8:00am - 6:00pm
    Thursday 8:00am - 6:00pm
    Friday 8:00am - 6:00pm
    Saturday 8:00am - 6:00pm
    Sunday Closed
    © 2023 Makar Eyecare. All Rights Reserved.
    Accessibility Statement - Privacy Policy - Sitemap`
    },
    { role: 'system', content: "I am Sammy, an AI-powered chatbot that is focused on Customer Support for sidekicksammy.com.  I can help you find help.  Makar Eye Care is open Mon-Sat 8a-6p.  They are located at 341 W. Tudor Rd., Suite 101 Anchorage, AK 99503.  You can reach us by phone at (907) 770-6652.  You can Fax them at (907) 770-3668.  You can also reach them online at https://www.makareyecare.com/contact-us.html" },
  ]
  let leadGenerationExample = [
    {
      role: 'user', content: `Outcome: """Lead Generation"""
    Greeting: """Hi, I'm Lenny! I want to help you with your questions, but I'm still learning. Can I have your email in case I can't answer your question?"""
    Home Page: """Sidekick Sammy Logo
    [Pricing](/pricing)
    [Get Started](/get-started)
    Boost Your Website's Superpowers

    with Sidekick Sammy

    Add an interactive, topic specific bot to your website.
    Let's Get Started

    SIDEKICK SAMMY FOR PRODUCTS

    For Product Companies:
    Amplify Your User Experience
    Let's Get Started

    Answer technical questions about your products and documentation, facilitating customer support
    Enhance user experiences by funneling potential customers to the right product solutions, boosting sales and reducing decision-making time
    Maximize customer satisfaction by addressing user queries immediately, increasing trust and loyalty
    SIDEKICK SAMMY FOR SERVICES

    For Service Companies:
    Elevate Your Client Interactions
    Let's Get Started
    Answer questions about your services, facilitating smoother client interactions and saving valuable time
    Boost lead generation by guiding potential clients toward your services, increasing conversion rates and enhancing your sales funnel
    Improve client satisfaction by addresing inquires in real-time, instilling confidence and fostering long-term partnerships

    LET'S GET STARTED

    $59/MONTH

    Let's Get Started
    Let's connect: Point us to your website address
    Let's crawl: We'll read your site content
    Let's chat: Your customized chatbot will be ready to serve
    Let's collaborate: We'll help integrate & refine your new tool
    Copyright © 2024. Sidekick Sammy`},
    { role: 'system', content: "I am Lenny, an AI-powered chatbot that is focused on Lead Generation for sidekicksammy.com.  I can help you find help.  SideKickSammy provides interactive, topic specific bots to help with your website.  They feature product and service bots.  My goal is to get you to try their product." },
  ]
  let informationRetrivalExample = [
    {
      role: 'user', content: `Outcome: """Information Retrieval"""
    Greeting: """Hi, I'm Izzy! I'm here to help you find information.  What information are you looking for?"""
    Home Page: """[jace.pro](/)
    * [JaceNow](/news)
    * [news.jace.pro](https://news.jace.pro)
    * [LinkedIn](https://linkedin.com/in/jacebenson)
    * [Blog](/blog)

    '# Welcome to **jace.pro**

    [JaceNow→Weekly news on YouTube](/news)[News Aggregator→All the ServiceNow news](https://news.jace.pro)[Discord→The ServiceNow Discord](https://discord.com/invite/y43VtUX)[My Blog→Here's where my 200+ posts are](/blog)

    Copyright © jace.pro 2022 Made with ❤ by [Jace Benson](https://jace.pro) • [View on Github](https://github.com/jacebenson/jace-pro-neat) • [RSS](/index.xml)"""` },
    { role: 'system', content: "I am Izzy, an AI-powered chatbot that is focused on Information Retrieval for jace.pro.  A ServiceNow Blog featuring JaceNow a weekly youtube show, a news aggregator, ServiceNow's Discord and his blog." },
  ]
  let appointmentSchedulingExample = [
    {
      role: 'user', content: `Outcome: """Appointment Scheduling"""
    Greeting: """Hi, I'm Addy! I'm here to help schedule an appointment.  Who would you like to schedule an appointment with?"""
    Home Page: """Skip to content
    logocf_w
    Book A Meeting
    Efficiently Navigate Licensing Challenges with Ease
    Book A Meeting
    Strategic Services
    Advisory Services
    We guarantee the achievement of your business goals, align the platform with your objectives, and evaluate your current licensing to keep you on track.

    Implementation Plans
    Implementation plans designed to improve ability to respond to industry changes in an efficient manner. We optimize and streamline plans to meet any objective.

    Strategic Planning
    We will research, formulate, and execute strategic plans and monitor their performance to ensure you are getting the most out of the ServiceNow platform.

    Workflow Services
    Integrations
    Helping extend your system functionality through ServiceNow's diverse integration options. Based on your needs we can connect different areas of your business.

    Custom App Development
    Custom applications designed and built with your needs in mind. We provide you with innovative ideas and solutions so we can deploy your ideas quickly and smoothly.

    Staff Augmentation
    Quality developers trained in the ServiceNow platform with extensive experience. Based on business needs we can provide temporary or permanent staff as required.

    Business Statistics
    Grow with CitrusFlows
    10 +
    Happy Customers

    15
    Projects Delivered

    2 +
    Team members

    100 K
    Revenue

    Let's Assess your licensing!
    30 minutes of my time with you will save you time and money.  I'll layout a licensing suggestion that aligns with the goals you have.
    [Book A Meeting](https://calendly.com/citrusflows/30min)

    Terms and Services
    Privacy Policy
    Powered by CitrusFlows
    HubSpot sprocket logo
    Built on HubSpot"""`
    },
    { role: 'system', content: "I am Addy, an AI-powered chatbot that is focused on Appointment Scheduling for citrusflows.com.  I can help you find help.  CitrusFlows provides Strategic Services, Workflow Services and Staff Augmentation.  You can meet with them using the link https://calendly.com/citrusflows/30min" },
  ]
  let shoppingAssistanceExample = [
    {
      role: 'user', content: `Outcome: """Shopping Assistance"""
    Greeting: """Hi, I'm Sally! I'm here to help you find products.  What are you looking for?"""
    Home Page: """Skip to main content

    Enable accessibility for visually impaired

    Open the accessibility menu

    Open the Accessible Navigation Menu

    Skinny Raven Sports
    [Shop](https://shop.skinnyraven.com/home)
    [Events](https://www.skinnyraven.com/events/)
    Run Groups
    Alaska's
    premier
    running and hiking store.
    Two convenient locations for all your Walk, Run, Hike needs!
    Downtown
    Dimond
    Image
    Image
    Shop All Studded Here
    Image
    [VJ Sarva Ace $190](https://shop.skinnyraven.com/vj-sarva-ace/)
    Staff Picks


    Taylor
    [Indyeva Selimut Down Vest $225](https://shop.skinnyraven.com/indyeve-selimut-down-vest/)


    Cyndi
    [Craft Storm Balance Tight $130](https://shop.skinnyraven.com/craft-storm-balance-tight/)


    JC
    [Noxgear Light Hound Vis Vest $70](https://shop.skinnyraven.com/noxgear-light-hound-vest/)


    Daniel
    [VJ Sarva Vakke $180](https://shop.skinnyraven.com/vj-sarva-vakke/)

    Jan. 1-31, 2024
    Start 2024 with a BANG!
    Learn More
    Raven
    Run Club
    Expert training from Team Raven.
    All abilities welcome!

    It's time
    Image
    The Skinny Raven Experience
    Skinny Raven Sports is Alaska's premier running specialty store, established in 1994. Our mission is simple: to better the community by helping our customers and staff better their lives. We fit all feet for a comfortable lifestyle.
    See our fit process
    Brands
    We Carry
    Shop now

    Skinny Raven Sports
    DOWNTOWN
    800 H Street
    Anchorage, AK
    (907) 274-7222
    Monday - Friday
    10:00 a.m. - 6:00 p.m.
    Saturday
    10:00 a.m. - 6:00 p.m.
    Closed Sunday

    DIMOND
    2727 W. Dimond Blvd.
    Anchorage, AK
    (907) 339-9991
    Closed Monday
    Tuesday - Friday
    10:00 a.m. - 6:00 p.m.
    Saturday
    10:00 a.m. - 6:00 p.m.
    Sunday
    11:00 a.m. - 5:00 p.m.

    Shop
    Run
    Walk
    Hike
    Gift Cards
    Fit Process
    Events
    Skinny Raven Events
    Policies
    Timing Services
    Other Supported Events
    Results Archive
    Run Groups
    Raven Run Club
    Kids Running
    Pub Run
    Contact
    Join Team Raven
    Donation Requests
    Health Care Providers
    Privacy Policy
    © Copyright 2024
    This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
    Image
    Designed by Winter Marketing & PR in Alaska
    """` },
    {
      role: 'system', content: "I am Sally, an AI-powered chatbot that is focused on Shopping Assistance for shop.skinnyraven.com.  I can help you find help.  Skinny Raven Sports is Alaska's premier running specialty store, established in 1994. Their mission is simple: to better the community by helping our customers and staff better their lives. We fit all feet for a comfortable lifestyle.  I can help you find products.  What are you looking for?"
    },
  ]
  let interactiveMarketingExample = [
    {
      role: 'user', content: `Outcome: """Interactive Marketing"""
    Greeting: """Hi, I'm Penny! I'm here to help you find products.  Do you want to see our latest promotions?"""
    Home Page: """mtgfestivals.com
    MagicCon: Chicago
    February 23-25, 2024
    Chicago
   Badges
   Info
   Experience
   Industry
   Art of Magic
   Magic Play
   [Guests](/guests)
   MagicCon: Chicago
   February 23-25, 2024
   Chicago
   [Badges and Ticketed Play events onsale now!](/tickets)
   MagicCon is coming to The Windy City!
   Wizards of the Coast and Reedpop are thrilled to kick of the 2024 festival event series dedicated to celebrating all things Magic: The Gathering in Chicago. Join us from February 23-25 for an incredible weekend full of Magic, featuring Pro Tour Murders at Karlov Manor, a variety of on-demand and ticketed play events such as Gavin Verhey’s Un-Known Event, Pro Tour Qualifiers, the Secret Lair Showdown and the $75k Open! Enjoy events and panels on the mainstage, immerse yourself in mystery, shop exclusive merch, meet some of your favorite Artists, Cosplayers, Magic celebrities and more!


   New to Magic: The Gathering?
   Play with your friends in a game that lets you explore rich worlds, discover unique strategies, and develop your skills.

   [Kaya - Learn how to Play Magic the Gathering](/learn)



   Join us for a Magic Murder Mystery
   48
   DAYS
   06
   HOURS
   08
   MINUTES
   05
   SECONDS

   Show Info
   February 23-25, 2024
   Chicago
   Have A Question?
   Join Our Newsletter!
   © 2023 Wizards of the Coast LLC
   [Contact Us](/contact-us)
   Website Terms & Conditions
   Ticket Terms of Service
   RX
   Fan Content Policy
   Code of Conduct
   Careers at ReedPop, join our team today!
   Support our mission to be Net Zero
   Privacy
   Privacy Policy
   Cookie Policy
   Your Privacy Choices
   California Consumer Privacy Act (CCPA) Opt-Out Icon
   Cookie Settings
   Facebook
   Twitter
   Instagram
   Another epic event by: ReedPop
   Wizards Of The Coast logo
   """` },
    { role: 'system', content: "I am Penny, an AI-powered chatbot that is focused on Promotions for https://mcchicago.mtgfestivals.com/.  I can help you find all the promotions.  Magiccon 2024 in the Windy city is going to be a blast be sure to check out out sessions, cosplay content, art wall and other amazing promotions." },
  ]


  let messages = [
    { role: 'system', content: `I am an experienced prompt designer specializing in creating effective prompts for topic-specific bots. With a deep understanding of various subjects and expert knowledge in bot design, I can provide concise and accurate information based on the given context. I strive to generate system prompts that effectively address user inquiries in the most efficient manner possible.` },
    { role: 'user', content: `As an expert prompt designer for topic specific bots, I need your assistance. Can you generate a system prompt for me?` },
    { role: 'system', content: `Certainly! I'm here to help you. Please provide me with the desired outcome, greeting and the home page information in markdown format.` },
  ]
  if (outcome === 'Customer Support') messages.concat(customerSupportExample)
  if (outcome === 'Lead Generation') messages.concat(leadGenerationExample)
  if (outcome === 'Information Retrieval') messages.concat(informationRetrivalExample)
  if (outcome === 'Appointment Scheduling') messages.concat(appointmentSchedulingExample)
  if (outcome === 'Shopping Assistance') messages.concat(shoppingAssistanceExample)
  if (outcome === 'Interactive Marketing') messages.concat(interactiveMarketingExample)

  messages.push({ role: 'user', content: `Outcome: """${outcome}"""\n\nGreeting: """${greeting}"""\n\nHome Page: """${markdown}"""` },)
  console.log({ messages })
  let openAIUrl = 'https://api.openai.com/v1/chat/completions'
  let openAIOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-16k',
      messages: messages,
      temperature: 0.9,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  }
  let openAIResponse = await fetch(openAIUrl, openAIOptions)
  let openAIJson = await openAIResponse.json()
  let prompt = openAIJson.choices[0].message.content
  return prompt

}
let mockError = (message) => {
  return {
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    urlSlug: 'error#' + message
  }
}
export const createBotAndUser = async ({ input }) => {
  //if (process.env.NODE_ENV === 'development') {
  //  return mockError('You are in development mode.  You cannot create a bot.')
  //}
  let slugUnique = await isSlugUnique(input.slug)
  if (slugUnique === false) return mockError(`Sorry, chatbot name "${input.slug}" is already taken`)
  let user = await createUserOrFindExisting(input)
  if (!user) return mockError('Could not create user')
  let corpus = await createCorpus(input)
  if (!corpus) return mockError('Could not create corpus')
  let prompt = await generatePrompt(input.url, input.greeting, input.outcome)
  if (!prompt) return mockError('Could not create prompt')
  //let source = await createFixieSource({
  //    ...input,
  //    depth: "0",
  //    corpusId: corpus.corpus.corpusId,
  //})
  let source = await createFixieSource({
    ...input,
    depth: 3,
    corpusId: corpus.corpus.corpusId,
  })
  if (!source) throw new Error('Could not create source')
  // create the bot
  let agent = await createFixieAgent({
    ...input,
    corpusId: corpus.corpus.corpusId,
    // lets build a prompt using the outcome
    prompt: prompt,
    handle: input.url.split('.')[0]
  })
  if (!agent) throw new Error('Could not create agent')

  let bot = await db.bot.create({
    data: {
      title: input.slug,
      urlSlug: input.slug,
      fixieCorpusId: corpus.corpus.corpusId,
      fixieAgentId: agent.data.createAgent.agent.uuid,
      backgroundColor: input.color,
      textColor: "white",
      greeting: input.greeting,
      hsActive: false,
      hsPrompt: JSON.stringify([{ "role": "system", "content": "You are an AI-powered chatbot" }, { "role": "user", "content": "Who are you?" }, { "role": "assistant", "content": "Hello, I'm AI Bot. I'm here to help you with any questions you may have. How can I help you?" }, { "role": "user", "content": "What can you do?" }, { "role": "assistant", "content": "I can help find blog posts" }]),
      User: {
        connect: {
          id: user.id,
        },
      },
    },
  })
  return bot
}
