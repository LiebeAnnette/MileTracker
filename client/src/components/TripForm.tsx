import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_VEHICLES } from "../graphql/vehicleQueries";
import { GET_ALERT_MESSAGES } from "../graphql/maintenanceQueries";
import {
  GET_TRIPS_BY_VEHICLE,
  GET_ALL_TRIPS_FOR_FORM,
} from "../graphql/tripQueries";
import Card from "./Card";
import Button from "./Button";
import { baseFieldStyles, selectFieldStyles } from "../../styles/styles";
import confetti from "canvas-confetti";

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

const TripForm: React.FC<{ onTripAdded?: () => void }> = ({ onTripAdded }) => {
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
    refetchQueries: [
      { query: GET_VEHICLES },
      { query: GET_ALERT_MESSAGES },
      {
        query: GET_TRIPS_BY_VEHICLE,
        variables: { vehicleId: formState.vehicleId },
      },
      { query: GET_ALL_TRIPS_FOR_FORM },
    ],
    onCompleted: () => {
      onTripAdded?.();
    },
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
    )
      return;

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
      confetti({
        particleCount: 200,
        spread: 100,
        angle: 90,
        origin: { x: 0.5, y: 0.5 },
      });

      setFormState({
        startStreet: "",
        startCity: "",
        startState: "",
        endStreet: "",
        endCity: "",
        endState: "",
        vehicleId: "",
        departureDate: getTodayDate(),
      });
    } catch (err) {
      console.error("Error adding trip:", err);
    }
  };
  let weatherDesc = "";
  let weatherTemp = "";
  let weatherEmoji = "";

  if (confirmation?.weather) {
    const parts = confirmation.weather.split(" ");
    weatherDesc = parts[0];
    weatherTemp = parts[1];
    const temp = parseFloat(weatherTemp);
    weatherEmoji = temp < 50 ? "❄️" : temp > 85 ? "🔥" : "🌤️";
  }

  return (
    <Card
      title={<h1 className="heading-xl text-center text-black">Add Trip</h1>}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4"
      >
        {vehicleLoading ? (
          <p>Loading vehicles...</p>
        ) : (
          <div className="w-full max-w-4xl flex justify-center">
            <select
              className={`${selectFieldStyles} w-1/2`}
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
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
          <div>
            <h4 className="heading-md text-black mb-2">Start Location</h4>
            <input
              className={baseFieldStyles}
              name="startStreet"
              placeholder="Street (optional)"
              value={formState.startStreet}
              onChange={handleChange}
            />
            <input
              className={baseFieldStyles}
              name="startCity"
              placeholder="City"
              value={formState.startCity}
              onChange={handleChange}
              required
            />
            <select
              className={selectFieldStyles}
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
          </div>

          <div>
            <h4 className="heading-md text-black mb-2">End Location</h4>
            <input
              className={baseFieldStyles}
              name="endStreet"
              placeholder="Street (optional)"
              value={formState.endStreet}
              onChange={handleChange}
            />
            <input
              className={baseFieldStyles}
              name="endCity"
              placeholder="City"
              value={formState.endCity}
              onChange={handleChange}
              required
            />
            <select
              className={selectFieldStyles}
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
          </div>
        </div>
        <div className="w-full max-w-4xl flex justify-center">
          <input
            className={`${baseFieldStyles} w-1/2`}
            type="date"
            name="departureDate"
            value={formState.departureDate}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Trip"}
        </Button>

        {error && <p className="text-red-600">Error: {error.message}</p>}
      </form>

      {confirmation && (
        <div className="mt-6 p-4 rounded-md bg-white text-[color:var(--prussian)] shadow-md w-full max-w-4xl mx-auto">
          <h3 className="heading-md text-[color:var(--teal)] mb-3 text-center">
            Trip Added Successfully!
          </h3>
          <p className="body-text mb-1 text-center">
            <strong>Miles:</strong>{" "}
            {confirmation.miles.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="body-text text-center">
            <strong>Weather at Destination:</strong> {weatherEmoji}{" "}
            {weatherDesc} {weatherTemp}
          </p>
        </div>
      )}
    </Card>
  );
};

export default TripForm;
