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

  type Query {
    trips: [Trip]
    totalMiles: Float
  }

  type Mutation {
    addTrip(startLocation: String!, endLocation: String!): Trip
  }
`;

export default typeDefs;
