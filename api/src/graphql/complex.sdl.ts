
export const schema = gql`

input CreateBotAndUserInput {
  url: String!
  outcome: String!
  color: String!
  greeting: String!
  email: String!
}

type Mutation {
  createBotAndUser(input: CreateBotAndUserInput!): Bot! @skipAuth
}
`