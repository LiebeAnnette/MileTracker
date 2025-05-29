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
export const GET_ALL_TRIPS_FOR_FORM = gql`
  query GetAllTrips {
    trips {
      _id
      startLocation
      endLocation
      miles
      date
      weather
      vehicle {
        _id
        name
      }
    }
  }
`;
