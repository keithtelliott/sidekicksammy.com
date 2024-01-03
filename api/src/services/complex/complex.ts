import type {
  QueryResolvers,
  MutationResolvers,
} from 'types/graphql'
import fetch from 'cross-fetch'
import { db } from 'src/lib/db'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import { slugify } from 'src/lib/text'
/**
 * for this frontend call
 * const CREATE_BOT_MUTATION = gql`
  mutation CreateBotAndUserMutation($input: CreateBotInput!) {
    createBot(input: $input) {
      id
    }
  }
`
lets a function to handle the input
 */
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
          maxDepth: 3,
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
export const createBotAndUser = async ({ input }) => {
  let user = await createUserOrFindExisting(input)
  if (!user) throw new Error('Could not create user')
  let corpus = await createCorpus(input)
  if (!corpus) throw new Error('Could not create corpus')
  let source = await createFixieSource({
    ...input,
    corpusId: corpus.corpus.corpusId,
  })
  if (!source) throw new Error('Could not create source')
  // create the bot
  let agent = await createFixieAgent({
    ...input,
    corpusId: corpus.corpus.corpusId,
    // lets build a prompt using the outcome
    prompt: "You are an AI-powered chatbot that is focused on " + input.outcome + " for " + input.url,
    handle: input.url.split('.')[0]
  })
  if (!agent) throw new Error('Could not create agent')

  let bot = await db.bot.create({
    data: {
      title: "My First Bot",
      urlSlug: parsedUrl(input.url).hostname,
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
