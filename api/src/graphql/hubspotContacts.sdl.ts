export const schema = gql`
  type HubspotContact {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!

    archived: Boolean!
    email: String!
    fixieCorpusId: String
    fixieAgentId: String
    hs_all_contact_vids: String!
    hs_email_domain: String!
    hs_is_contact: String!
    hs_is_unworked: String!
    hs_lifecyclestage_lead_date: String!
    hs_object_id: String!
    hs_object_source_id: String!
    hs_object_source: String!
    hs_pipeline: String!
    lastmodifieddate: String!
    lifecyclestage: String!
    outcomes: String
    personality: String
    sidekickTitle: String
    sidekickColorScheme: String
    sidekickGreeting: String
    status: String
    website: String!
  }

  input CreateHubspotContactInput {
    archived: Boolean
    email: String!
    fixieCorpusId: String
    hs_all_contact_vids: String
    hs_email_domain: String
    hs_is_contact: String
    hs_is_unworked: String
    hs_lifecyclestage_lead_date: String
    hs_object_id: String
    hs_object_source_id: String
    hs_object_source: String
    hs_pipeline: String
    lastmodifieddate: String
    lifecyclestage: String
    outcomes: String
    personality: String
    sidekickTitle: String
    sidekickColorScheme: String
    website: String!
  }
  type HubspotError {
    message: String!
    status: String!
  }
  type SocialProof {
    logo: String!
    title: String!
    link: String!
  }
  type Query {
    getHubspotContact(title: String!): HubspotContact!
      @skipAuth
    socialProof: [SocialProof] @skipAuth

  }

  type Mutation {
    createHubspotContact(input: CreateHubspotContactInput!): HubspotContact!
      @skipAuth
  }
`
