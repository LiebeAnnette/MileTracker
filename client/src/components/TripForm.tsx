import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_VEHICLES } from "../graphql/vehicleQueries";

const ADD_TRIP = gql`
  mutation AddTrip(
    $startLocation: String!
    $endLocation: String!
    $vehicleId: ID!
  ) {
    addTrip(
      startLocation: $startLocation
      endLocation: $endLocation
      vehicleId: $vehicleId
    ) {
      _id
      startLocation
      endLocation
      miles
      weather
      date
    }
  }
`;

const TripForm: React.FC = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [confirmation, setConfirmation] = useState<{
    miles: number;
    weather: string;
  } | null>(null);

  const { data: vehicleData, loading: vehicleLoading } = useQuery(GET_VEHICLES);

  const [addTrip, { loading, error }] = useMutation(ADD_TRIP, {
    refetchQueries: ["GetTrips"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startLocation || !endLocation || !vehicleId) return;

    try {
      const result = await addTrip({
        variables: { startLocation, endLocation, vehicleId },
      });

      const { miles, weather } = result.data.addTrip;
      setConfirmation({ miles, weather });
      setStartLocation("");
      setEndLocation("");
      setVehicleId("");
    } catch (err) {
      console.error("Error adding trip:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {vehicleLoading ? (
          <p>Loading vehicles...</p>
        ) : (
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            <option value="">Select a vehicle</option>
            {vehicleData?.vehicles.map((v: any) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        )}

        <input
          placeholder="Start location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <input
          placeholder="End location"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Trip"}
        </button>
        {error && <p>Error: {error.message}</p>}
      </form>

      {confirmation && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Trip added!</strong>
          </p>
          <p>Miles: {confirmation.miles}</p>
          <p>Weather at destination: {confirmation.weather}</p>
        </div>
      )}
    </div>
  );
};

export default TripForm;
