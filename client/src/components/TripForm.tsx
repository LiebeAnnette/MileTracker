import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_VEHICLES } from "../graphql/vehicleQueries";

const ADD_TRIP = gql`
  mutation AddTrip(
    $startLocation: String!
    $endLocation: String!
    $vehicleId: ID!
    $departureDate: String!
  ) {
    addTrip(
      startLocation: $startLocation
      endLocation: $endLocation
      vehicleId: $vehicleId
      departureDate: $departureDate
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

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const getTodayDate = (): string => {
  const today = new Date();
  const offsetDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );
  return offsetDate.toISOString().split("T")[0];
};

const TripForm: React.FC = () => {
  const [formState, setFormState] = useState({
    startStreet: "",
    startCity: "",
    startState: "",
    endStreet: "",
    endCity: "",
    endState: "",
    vehicleId: "",
    departureDate: getTodayDate(),
  });

  const [confirmation, setConfirmation] = useState<{
    miles: number;
    weather: string;
  } | null>(null);

  const { data: vehicleData, loading: vehicleLoading } = useQuery(GET_VEHICLES);
  const [addTrip, { loading, error }] = useMutation(ADD_TRIP, {
    refetchQueries: ["GetTrips"],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      startStreet,
      startCity,
      startState,
      endStreet,
      endCity,
      endState,
      vehicleId,
      departureDate,
    } = formState;

    if (
      !startCity ||
      !startState ||
      !endCity ||
      !endState ||
      !vehicleId ||
      !departureDate
    ) {
      return;
    }

    const startLocation = `${
      startStreet ? startStreet + ", " : ""
    }${startCity}, ${startState}`;
    const endLocation = `${
      endStreet ? endStreet + ", " : ""
    }${endCity}, ${endState}`;

    try {
      const result = await addTrip({
        variables: { startLocation, endLocation, vehicleId, departureDate },
      });

      const { miles, weather } = result.data.addTrip;
      setConfirmation({ miles, weather });

      setFormState({
        startStreet: "",
        startCity: "",
        startState: "",
        endStreet: "",
        endCity: "",
        endState: "",
        vehicleId: "",
        departureDate: "",
      });
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
            name="vehicleId"
            value={formState.vehicleId}
            onChange={handleChange}
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

        <h4>Start Location</h4>
        <input
          name="startStreet"
          placeholder="Street (optional)"
          value={formState.startStreet}
          onChange={handleChange}
        />
        <input
          name="startCity"
          placeholder="City"
          value={formState.startCity}
          onChange={handleChange}
          required
        />
        <select
          name="startState"
          value={formState.startState}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          {US_STATES.map((abbr) => (
            <option key={abbr} value={abbr}>
              {abbr}
            </option>
          ))}
        </select>

        <h4>End Location</h4>
        <input
          name="endStreet"
          placeholder="Street (optional)"
          value={formState.endStreet}
          onChange={handleChange}
        />
        <input
          name="endCity"
          placeholder="City"
          value={formState.endCity}
          onChange={handleChange}
          required
        />
        <select
          name="endState"
          value={formState.endState}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          {US_STATES.map((abbr) => (
            <option key={abbr} value={abbr}>
              {abbr}
            </option>
          ))}
        </select>

        <h4>Departure Date</h4>
        <input
          type="date"
          name="departureDate"
          value={formState.departureDate}
          onChange={handleChange}
          required
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
          <p>Miles: {confirmation.miles.toFixed(2)}</p>
          <p>Weather at destination: {confirmation.weather}</p>
        </div>
      )}
    </div>
  );
};

export default TripForm;
