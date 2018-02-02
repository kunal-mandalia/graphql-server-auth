const { buildSchema } = require('graphql')

const schema = (buildSchemaGQL = buildSchema) => buildSchemaGQL(`
  interface Person {
    username: String!
    email: String!
  }

  type User implements Person {
    username: String!
    email: String!
  }

  type UserWithToken implements Person {
    username: String!
    email: String!
    token: String!
  }

  input UserCredentials {
    username: String!
    password: String!
  }

  input AuthToken {
    token: String
  }

  type Query {
    login(input: UserCredentials): String
    getMyProfile: User
  }

  type Mutation {
    updateUsername(input: String): UserWithToken
  }
`)

module.exports = schema
