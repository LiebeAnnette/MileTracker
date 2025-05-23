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
  type MaintenanceAlert {
    vehicleId: ID!
    vehicleName: String!
    totalMiles: Float!
    threshold: Float!
    alert: String!
  }

  type Query {
    trips: [Trip]
    totalMiles: Float
    me: User
    vehicles: [Vehicle]
    maintenanceAlerts: [MaintenanceAlert]
    getTripsByVehicle(vehicleId: ID!): [Trip]
  }

  type Mutation {
    addTrip(
      startLocation: String!
      endLocation: String!
      vehicleId: ID!
      departureDate: String!
    ): Trip
    register(username: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    deleteTrip(_id: ID!): Trip
    addVehicle(
      name: String!
      make: String
      vehicleModel: String
      maintenanceReminderMiles: Float!
    ): Vehicle
    deleteVehicle(_id: ID!): Vehicle
    updateVehicle(
      _id: ID!
      name: String
      maintenanceReminderMiles: Float
    ): Vehicle
  }
`;

export default typeDefs;
