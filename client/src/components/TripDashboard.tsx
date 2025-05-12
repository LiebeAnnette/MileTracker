import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_TRIPS = gql`
  query GetTrips {
    trips {
      _id
      startLocation
      endLocation
      miles
      date
      weather
    }
    totalMiles
  }
`;

const TripDashboard: React.FC = () => {
  const { data, loading, error } = useQuery(GET_TRIPS);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error loading trips: {error.message}</p>;

  return (
    <div>
      <h2>All Trips</h2>
      <ul>
        {data.trips.map((trip: any) => (
          <li key={trip._id}>
            {trip.startLocation} → {trip.endLocation} | {trip.miles} miles |{" "}
            {trip.weather} | {new Date(trip.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h3>Total Miles: {data.totalMiles}</h3>
    </div>
  );
};

export default TripDashboard;
