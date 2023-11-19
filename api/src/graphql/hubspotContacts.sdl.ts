export const schema = gql`
  type HubspotContact {
    id: Int!
    email: String!
    hs_all_contact_vids: String!
    hs_email_domain: String!
    hs_is_contact: String!
    hs_is_unworked: String!
    hs_lifecyclestage_lead_date: String!
    hs_object_id: String!
    hs_object_source: String!
    hs_object_source_id: String!
    hs_pipeline: String!
    lastmodifieddate: String!
    lifecyclestage: String!
    website: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    archived: Boolean!
    status: String
  }

  input CreateHubspotContactInput {
    email: String!
    hs_all_contact_vids: String
    hs_email_domain: String
    hs_is_contact: String
    hs_is_unworked: String
    hs_lifecyclestage_lead_date: String
    hs_object_id: String
    hs_object_source: String
    hs_object_source_id: String
    hs_pipeline: String
    lastmodifieddate: String
    lifecyclestage: String
    website: String!
    archived: Boolean
  }
  type HubspotError {
    message: String!
    status: String!
  }

  type Mutation {
    createHubspotContact(input: CreateHubspotContactInput!): HubspotContact!
      @skipAuth
  }
`
