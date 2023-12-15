export const schema = gql`
  type HubspotBot {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    refreshToken: String
    refreshTokenExpiresAt: DateTime
    prompt: String
    channelAccountId: String
    channelId: String
    hubspotUserId: String
    fixieCorpusId: String
    urlSlug: String
    logoUrl: String
    backgroundColor: String
    textColor: String
    userId: Int
    User: User
  }

  type Query {
    hubspotBots: [HubspotBot!]! @requireAuth
    hubspotBot(id: Int!): HubspotBot @requireAuth
  }

  input CreateHubspotBotInput {
    refreshToken: String
    refreshTokenExpiresAt: DateTime
    prompt: String
    channelAccountId: String
    channelId: String
    hubspotUserId: String
    fixieCorpusId: String
    urlSlug: String
    logoUrl: String
    backgroundColor: String
    textColor: String
    userId: Int
  }

  input UpdateHubspotBotInput {
    refreshToken: String
    refreshTokenExpiresAt: DateTime
    prompt: String
    channelAccountId: String
    channelId: String
    hubspotUserId: String
    fixieCorpusId: String
    urlSlug: String
    logoUrl: String
    backgroundColor: String
    textColor: String
    userId: Int
  }

  type Mutation {
    createHubspotBot(input: CreateHubspotBotInput!): HubspotBot! @requireAuth
    updateHubspotBot(id: Int!, input: UpdateHubspotBotInput!): HubspotBot!
      @requireAuth
    deleteHubspotBot(id: Int!): HubspotBot! @requireAuth
  }
`
