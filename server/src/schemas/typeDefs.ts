import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Trip {
    _id: ID!
    startLocation: String!
    endLocation: String!
    miles: Float!
    date: String!
    weather: String
    vehicle: Vehicle
  }

  type User {
    _id: ID!
    username: String!
  }

  type Auth {
    token: String!
    user: User!
  }
  type Vehicle {
    _id: ID!
    name: String!
    make: String
    vehicleModel: String
    maintenanceReminderMiles: Float!
  }

  type Query {
    trips: [Trip]
    totalMiles: Float
    me: User
    vehicles: [Vehicle]
  }

  type Mutation {
    addTrip(startLocation: String!, endLocation: String!, vehicleId: ID!): Trip
    register(username: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    deleteTrip(_id: ID!): Trip
    addVehicle(
      name: String!
      make: String
      vehicleModel: String
      maintenanceReminderMiles: Float!
    ): Vehicle
  }
`;

export default typeDefs;
