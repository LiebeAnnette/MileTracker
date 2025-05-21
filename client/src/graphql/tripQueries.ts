// src/graphql/tripQueries.ts
import { gql } from "@apollo/client";

export const GET_TRIPS_BY_VEHICLE = gql`
  query GetTripsByVehicle($vehicleId: ID!) {
    getTripsByVehicle(vehicleId: $vehicleId) {
      startLocation
      endLocation
      miles
      date
      weather
      vehicle {
        name
      }
    }
  }
`;
