import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const ADD_TRIP = gql`
  mutation AddTrip($startLocation: String!, $endLocation: String!) {
    addTrip(startLocation: $startLocation, endLocation: $endLocation) {
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
  const [confirmation, setConfirmation] = useState<{
    miles: number;
    weather: string;
  } | null>(null);

  const [addTrip, { loading, error }] = useMutation(ADD_TRIP, {
    refetchQueries: ["GetTrips"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startLocation || !endLocation) return;

    try {
      const result = await addTrip({
        variables: { startLocation, endLocation },
      });

      const { miles, weather } = result.data.addTrip;
      setConfirmation({ miles, weather });
      setStartLocation("");
      setEndLocation("");
    } catch (err) {
      console.error("Error adding trip:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
