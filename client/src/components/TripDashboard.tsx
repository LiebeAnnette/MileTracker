import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import "../TripDashboard.css";

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

const DELETE_TRIP = gql`
  mutation DeleteTrip($_id: ID!) {
    deleteTrip(_id: $_id) {
      _id
    }
  }
`;

const TripDashboard: React.FC = () => {
  const { data, loading, error } = useQuery(GET_TRIPS);
  const [deleteTrip] = useMutation(DELETE_TRIP, {
    refetchQueries: ["GetTrips"],
  });

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error loading trips: {error.message}</p>;

  return (
    <div className="dashboard-container">
      <h2>All Trips</h2>
      <ul>
        {data.trips.map((trip: any) => (
          <li
            key={trip._id}
            style={{ marginBottom: "0.75rem" }}
            className="trip-card"
          >
            <div>
              {trip.startLocation} → {trip.endLocation} | {trip.miles} miles |{" "}
              {trip.weather} | {new Date(trip.date).toLocaleDateString()}
            </div>
            <button
              onClick={() => deleteTrip({ variables: { _id: trip._id } })}
              style={{
                marginTop: "0.25rem",
                backgroundColor: "#cc3333",
                color: "white",
                border: "none",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <h3 className="total-miles">Total Miles: {data.totalMiles}</h3>
    </div>
  );
};

export default TripDashboard;
