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

  type MaintenanceReminder {
    name: String!
    mileage: Float!
    lastResetMileage: Float
  }

  input MaintenanceReminderInput {
    name: String!
    mileage: Float!
  }

  type Vehicle {
    _id: ID!
    name: String!
    make: String
    vehicleModel: String
    maintenanceReminders: [MaintenanceReminder]
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
    getMyExpenseFolders: [ExpenseFolder]
    getParkFact: String
  }

  type Expense {
    category: String!
    amount: Float!
    description: String
  }

  type ExpenseFolder {
    _id: ID!
    title: String!
    createdAt: String
    expenses: [Expense]
  }

  type Mutation {
    register(username: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    addExpenseFolder(title: String!): ExpenseFolder

    addTrip(
      startLocation: String!
      endLocation: String!
      vehicleId: ID!
      departureDate: String!
    ): Trip

    deleteTrip(_id: ID!): Trip

    addVehicle(
      name: String!
      make: String
      vehicleModel: String
      maintenanceReminders: [MaintenanceReminderInput]
    ): Vehicle

    deleteVehicle(_id: ID!): Vehicle

    updateVehicle(_id: ID!, name: String): Vehicle

    addMaintenanceReminder(
      vehicleId: ID!
      name: String!
      mileage: Float!
    ): Vehicle

    updateMaintenanceReminder(
      vehicleId: ID!
      name: String!
      mileage: Float!
    ): Vehicle

    resetMaintenanceReminder(vehicleId: ID!, name: String!): Vehicle

    deleteMaintenanceReminder(vehicleId: ID!, name: String!): Vehicle
  }
`;

export default typeDefs;
