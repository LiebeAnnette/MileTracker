import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext"; // import the auth context
import { GET_ALERT_MESSAGES } from "../graphql/maintenanceQueries";
import Card from "./Card";
import Button from "./Button";
import { baseFieldStyles, selectFieldStyles } from "../../styles/styles";

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
    <Card
      title={
        <div className="heading-xl text-center text-black">Trip Dashboard</div>
      }
    >
      <div className="flex flex-col items-center space-y-8 w-full">
        {alertData?.maintenanceAlerts?.length > 0 && (
          <div className="w-full bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg shadow-sm">
            <h4 className="heading-md mb-2 text-[color:var(--orange)]">
              Maintenance Alerts
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {alertData.maintenanceAlerts.map((a: any) => (
                <li key={a.vehicleId}>
                  <span className="font-semibold">{a.vehicleName}</span> has
                  reached{" "}
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

        <div className="w-full space-y-6">
          <h2 className="heading-lg text-center text-[color:var(--prussian)]">
            All Trips
          </h2>

          <ul className="space-y-6">
            {data.trips.map((trip: any) => (
              <li
                key={trip._id}
                className="w-full max-w-4xl mx-auto bg-[color:var(--sky)] bg-opacity-10 border border-[color:var(--sky)] rounded-xl p-4 shadow-sm"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[color:var(--off-white)] bg-opacity-90 border-2 border-[color:var(--pink)] p-3 rounded-xl space-y-1">
                    <h4 className="text-lg font-semibold text-[color:var(--prussian)]">
                      From
                    </h4>
                    <div className="text-lg text-black leading-snug">
                      {trip.startLocation?.split(",")[0]}
                      <div>
                        {trip.startLocation?.split(",").slice(1).join(",")}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[color:var(--off-white)] bg-opacity-90 border-2 border-[color:var(--pink)] p-3 rounded-xl space-y-1">
                    <h4 className="text-lg font-semibold text-[color:var(--prussian)]">
                      To
                    </h4>
                    <div className="text-lg text-black leading-snug">
                      {trip.endLocation?.split(",")[0]}
                      <div>
                        {trip.endLocation?.split(",").slice(1).join(",")}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[color:var(--off-white)] bg-opacity-90 border-2 border-[color:var(--pink)] p-3 rounded-xl space-y-1">
                    <h4 className="text-lg font-semibold text-[color:var(--prussian)]">
                      Miles
                    </h4>
                    <div className="text-lg text-black">
                      {trip.miles.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      miles
                    </div>
                  </div>

                  <div className="bg-[color:var(--off-white)] bg-opacity-90 border-2 border-[color:var(--pink)] p-3 rounded-xl space-y-1">
                    <h4 className="text-lg font-semibold text-[color:var(--prussian)]">
                      Weather
                    </h4>
                    <div className="text-lg text-black">{trip.weather}</div>
                  </div>

                  <div className="bg-[color:var(--off-white)] bg-opacity-90 border-2 border-[color:var(--pink)] p-3 rounded-xl space-y-1">
                    <h4 className="text-lg font-semibold text-[color:var(--prussian)]">
                      Date
                    </h4>
                    <div className="text-lg text-black">
                      {new Date(trip.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="bg-[color:var(--off-white)] bg-opacity-90 border-2 border-[color:var(--pink)] p-3 rounded-xl space-y-1">
                    <h4 className="text-lg font-semibold text-[color:var(--prussian)]">
                      Vehicle
                    </h4>
                    <div className="text-lg text-black">
                      {trip.vehicle?.name ?? "N/A"}{" "}
                      {trip.vehicle?.make && (
                        <span className="text-gray-500 text-base">
                          ({trip.vehicle.make})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <Button
                    onClick={() => deleteTrip({ variables: { _id: trip._id } })}
                    className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-center pt-6 border-t border-gray-300 mt-6">
            <h3 className="heading-md text-[color:var(--teal)]">
              Total Miles:{" "}
              {data.totalMiles.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripDashboard;
