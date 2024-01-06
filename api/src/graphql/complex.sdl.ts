
export const schema = gql`

input CreateBotAndUserInput {
  slug: String!
  url: String!
  color: String!
  greeting: String!
  outcome: String!
  email: String!
}

type Mutation {
  createBotAndUser(input: CreateBotAndUserInput!): Bot! @skipAuth
}
`
