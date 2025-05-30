import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import { GET_ALERT_MESSAGES } from "../graphql/maintenanceQueries";
import Card from "./Card";
import Button from "./Button";
import { selectFieldStyles } from "../../styles/styles";

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
  const { token } = useAuth();
  const { data, loading, error } = useQuery(GET_TRIPS);
  const { data: alertData } = useQuery(GET_ALERT_MESSAGES, {
    skip: typeof token !== "string" || !token,
  });

  const [deleteTrip] = useMutation(DELETE_TRIP, {
    refetchQueries: [{ query: GET_TRIPS }],
  });

  const [selectedVehicle, setSelectedVehicle] = useState("All");

  const uniqueVehicles: string[] = Array.from(
    new Set(
      data?.trips
        .map((t: any) => t.vehicle?.name)
        .filter((name: unknown): name is string => typeof name === "string")
    )
  );

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error loading trips: {error.message}</p>;

  const filteredTrips = data.trips.filter((trip: any) =>
    selectedVehicle === "All" ? true : trip.vehicle?.name === selectedVehicle
  );

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
          {/* <h2 className="heading-lg text-center text-[color:var(--prussian)]">
            All Trips
          </h2> */}

          <div className="flex justify-center mb-4">
            <div className="w-full max-w-md flex items-center justify-center space-x-2">
              <label className="text-[color:var(--prussian)] mr-2 font-semibold">
                Filter by Vehicle:
              </label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className={`${selectFieldStyles} w-1/2`}
              >
                <option value="All">All Vehicles</option>
                {uniqueVehicles.map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTrips.map((trip: any, index: number) => {
              let tripNumber = index + 1;

              if (selectedVehicle !== "All") {
                const sameVehicleTrips = filteredTrips.filter(
                  (t: any) => t.vehicle?.name === trip.vehicle?.name
                );
                tripNumber =
                  sameVehicleTrips.findIndex((t: any) => t._id === trip._id) +
                  1;
              }

              return (
                <li
                  key={trip._id}
                  className="bg-[color:var(--sky)] bg-opacity-10 border border-[color:var(--sky)] rounded-xl p-3 shadow-sm text-base space-y-3"
                >
                  {[
                    {
                      label: "Vehicle",
                      content: (
                        <>
                          Trip {tripNumber}: {trip.vehicle?.name ?? "N/A"}{" "}
                          {trip.vehicle?.make && (
                            <span className="text-gray-500 text-sm">
                              ({trip.vehicle.make})
                            </span>
                          )}
                        </>
                      ),
                    },
                    {
                      label: "Date",
                      content: new Date(trip.date).toLocaleDateString(),
                    },
                    {
                      label: "From",
                      content: (
                        <>
                          {trip.startLocation?.split(",")[0]}
                          <div className="text-gray-600 text-sm">
                            {trip.startLocation?.split(",").slice(1).join(",")}
                          </div>
                        </>
                      ),
                    },
                    {
                      label: "To",
                      content: (
                        <>
                          {trip.endLocation?.split(",")[0]}
                          <div className="text-gray-600 text-sm">
                            {trip.endLocation?.split(",").slice(1).join(",")}
                          </div>
                        </>
                      ),
                    },
                    {
                      label: "Miles",
                      content: `${trip.miles.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} miles`,
                    },
                    {
                      label: "Weather",
                      content: trip.weather,
                    },
                  ].map(({ label, content }) => (
                    <div
                      key={label}
                      className="bg-[color:var(--off-white)] bg-opacity-90 border-2 border-[color:var(--pink)] p-2 rounded-lg space-y-1"
                    >
                      <h4 className="font-semibold text-[color:var(--prussian)]">
                        {label}
                      </h4>
                      <div className="text-black">{content}</div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <Button
                      onClick={() =>
                        deleteTrip({ variables: { _id: trip._id } })
                      }
                      className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1"
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              );
            })}
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
