import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext"; // import the auth context
import { GET_ALERT_MESSAGES } from "../graphql/maintenanceQueries";

const GET_TRIPS = gql`
  query GetTrips {
    trips {
      _id
      startLocation
      endLocation
      miles
      date
      weather
      vehicle {
        name
        make
      }
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
  const { token } = useAuth(); // Get token from AuthContext

  // Fetch trips
  const { data, loading, error } = useQuery(GET_TRIPS);

  // Fetch maintenance alerts only if authenticated (skip if no token)
  const { data: alertData } = useQuery(GET_ALERT_MESSAGES, {
    skip: typeof token !== "string" || !token, // Skip if no token is present (user not authenticated)
  });

  const [deleteTrip] = useMutation(DELETE_TRIP, {
    refetchQueries: ["GetTrips"],
  });

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error loading trips: {error.message}</p>;

  return (
    <div className="dashboard-container">
      {alertData?.maintenanceAlerts?.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "1rem",
            marginBottom: "1rem",
            border: "1px solid #ffeeba",
            borderRadius: "4px",
          }}
        >
          <h4>Maintenance Alerts</h4>
          <ul>
            {alertData.maintenanceAlerts.map((a: any) => (
              <li key={a.vehicleId}>
                {a.vehicleName} has reached{" "}
                {a.totalMiles.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                miles and needs maintenance (limit:{" "}
                {a.threshold.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                ).
              </li>
            ))}
          </ul>
        </div>
      )}
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
              {trip.weather} | {new Date(trip.date).toLocaleDateString()} |{" "}
              Vehicle: {trip.vehicle?.name ?? "N/A"}{" "}
              {trip.vehicle?.make && `(${trip.vehicle.make})`}
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
      <h3 className="total-miles">
        Total Miles:{" "}
        {data.totalMiles.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h3>
    </div>
  );
};

export default TripDashboard;
