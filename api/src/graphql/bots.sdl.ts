export const schema = gql`
  type Bot {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    hsRefreshToken: String
    hsRefreshTokenExpiresAt: DateTime
    hsPrompt: String
    hsChannelAccountId: String
    hsChannelId: String
    hsUserId: String
    fixieCorpusId: String
    cardImageUrl: String
    description: String
    urlSlug: String
    logoUrl: String
    backgroundColor: String
    textColor: String
    greeting: String
    userId: Int
    User: User
  }

  type Query {
    bots: [Bot!]! @requireAuth
    bot(id: Int!): Bot @requireAuth
  }

  input CreateBotInput {
    hsRefreshToken: String
    hsRefreshTokenExpiresAt: DateTime
    hsPrompt: String
    hsChannelAccountId: String
    hsChannelId: String
    hsUserId: String
    fixieCorpusId: String
    cardImageUrl: String
    description: String
    urlSlug: String
    logoUrl: String
    backgroundColor: String
    textColor: String
    userId: Int
  }

  input UpdateBotInput {
    hsRefreshToken: String
    hsRefreshTokenExpiresAt: DateTime
    hsPrompt: String
    hsChannelAccountId: String
    hsChannelId: String
    hsUserId: String
    fixieCorpusId: String
    cardImageUrl: String
    description: String
    urlSlug: String
    logoUrl: String
    backgroundColor: String
    textColor: String
    greeting: String
    userId: Int
  }

  type Mutation {
    createBot(input: CreateBotInput!): Bot! @requireAuth
    updateBot(id: Int!, input: UpdateBotInput!): Bot! @requireAuth
    deleteBot(id: Int!): Bot! @requireAuth
  }
`
