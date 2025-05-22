import { gql } from "@apollo/client";

export const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      _id
      name
      make
      vehicleModel
      maintenanceReminderMiles
    }
  }
`;

export const ADD_VEHICLE = gql`
  mutation AddVehicle(
    $name: String!
    $make: String
    $vehicleModel: String
    $maintenanceReminderMiles: Float!
  ) {
    addVehicle(
      name: $name
      make: $make
      vehicleModel: $vehicleModel
      maintenanceReminderMiles: $maintenanceReminderMiles
    ) {
      _id
      name
      make
      vehicleModel
      maintenanceReminderMiles
    }
  }
`;
export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($_id: ID!) {
    deleteVehicle(_id: $_id) {
      _id
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle(
    $_id: ID!
    $name: String
    $maintenanceReminderMiles: Float
  ) {
    updateVehicle(
      _id: $_id
      name: $name
      maintenanceReminderMiles: $maintenanceReminderMiles
    ) {
      _id
      name
      maintenanceReminderMiles
    }
  }
`;
