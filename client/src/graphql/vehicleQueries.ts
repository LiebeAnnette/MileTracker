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
