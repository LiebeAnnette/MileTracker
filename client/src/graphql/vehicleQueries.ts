import { gql } from "@apollo/client";

export const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      _id
      name
      make
      vehicleModel
      maintenanceReminders {
        name
        mileage
        lastResetMileage
      }
    }
  }
`;

export const ADD_VEHICLE = gql`
  mutation AddVehicle($name: String!, $make: String, $vehicleModel: String) {
    addVehicle(name: $name, make: $make, vehicleModel: $vehicleModel) {
      _id
      name
      make
      vehicleModel
      maintenanceReminders {
        name
        mileage
        lastResetMileage
      }
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
  mutation UpdateVehicle($_id: ID!, $name: String) {
    updateVehicle(_id: $_id, name: $name) {
      _id
      name
    }
  }
`;

export const ADD_MAINTENANCE_REMINDER = gql`
  mutation AddMaintenanceReminder(
    $vehicleId: ID!
    $name: String!
    $mileage: Float!
  ) {
    addMaintenanceReminder(
      vehicleId: $vehicleId
      name: $name
      mileage: $mileage
    ) {
      _id
      maintenanceReminders {
        name
        mileage
        lastResetMileage
      }
    }
  }
`;

export const UPDATE_MAINTENANCE_REMINDER = gql`
  mutation UpdateMaintenanceReminder(
    $vehicleId: ID!
    $name: String!
    $mileage: Float!
  ) {
    updateMaintenanceReminder(
      vehicleId: $vehicleId
      name: $name
      mileage: $mileage
    ) {
      _id
      maintenanceReminders {
        name
        mileage
        lastResetMileage
      }
    }
  }
`;

export const RESET_MAINTENANCE_REMINDER = gql`
  mutation ResetMaintenanceReminder($vehicleId: ID!, $name: String!) {
    resetMaintenanceReminder(vehicleId: $vehicleId, name: $name) {
      _id
      maintenanceReminders {
        name
        mileage
        lastResetMileage
      }
    }
  }
`;

export const DELETE_MAINTENANCE_REMINDER = gql`
  mutation DeleteMaintenanceReminder($vehicleId: ID!, $name: String!) {
    deleteMaintenanceReminder(vehicleId: $vehicleId, name: $name) {
      _id
      maintenanceReminders {
        name
        mileage
        lastResetMileage
      }
    }
  }
`;
