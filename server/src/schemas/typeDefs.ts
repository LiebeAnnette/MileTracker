import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Trip {
    _id: ID!
    startLocation: String!
    endLocation: String!
    miles: Float!
    date: String!
    weather: String
  }

  type User {
    _id: ID!
    username: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    trips: [Trip]
    totalMiles: Float
    me: User
  }

  type Mutation {
    addTrip(startLocation: String!, endLocation: String!): Trip
    register(username: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
  }
`;

export default typeDefs;
