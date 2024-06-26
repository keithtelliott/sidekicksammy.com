export const schema = gql`
  type Bot {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    backgroundColor: String
    cardImageUrl: String
    description: String
    fixieCorpusId: String
    fixieAgentId: String
    corpusRefetchIntervalDays: Int
    greeting: String
    hsActive: Boolean
    hsPrompt: String
    hsRefreshToken: String
    hsAccessToken: String
    hsAccessTokenExpiresAt: DateTime
    hsUserId: Int
    logoUrl: String
    title: String
    textColor: String
    urlSlug: String
    userId: Int
    User: User
  }

  type Query {
    bots: [Bot!]! @requireAuth
    bot(id: Int!): Bot @requireAuth
    botBySlug(urlSlug: String!): Bot @skipAuth
  }

  input CreateBotInput {
    backgroundColor: String
    cardImageUrl: String
    description: String
    fixieCorpusId: String
    fixieAgentId: String
    corpusRefetchIntervalDays: Int
    hsActive: Boolean
    hsAppId: Int
    hsPortalId: Int
    hsPrompt: String
    hsRefreshToken: String
    hsAccessToken: String
    hsAccessTokenExpiresAt: DateTime
    hsUserId: Int
    logoUrl: String
    title: String
    textColor: String
    urlSlug: String
    userId: Int
  }

  input UpdateBotInput {
    backgroundColor: String
    cardImageUrl: String
    description: String
    fixieCorpusId: String
    fixieAgentId: String
    corpusRefetchIntervalDays: Int
    greeting: String
    hsActive: Boolean
    hsAppId: Int
    hsPortalId: Int
    hsPrompt: String
    hsRefreshToken: String
    hsAccessToken: String
    hsAccessTokenTokenExpiresAt: DateTime
    hsUserId: Int
    logoUrl: String
    textColor: String
    title: String
    urlSlug: String
    userId: Int
  }

  type Mutation {
    createBot(input: CreateBotInput!): Bot! @requireAuth
    updateBot(id: Int!, input: UpdateBotInput!): Bot! @requireAuth
    deleteBot(id: Int!): Bot! @requireAuth
  }
`
