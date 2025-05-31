import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import jsPDF from "jspdf";
import { GET_VEHICLES } from "../graphql/vehicleQueries";
import { GET_TRIPS_BY_VEHICLE } from "../graphql/tripQueries";
import Card from "./Card";
import Button from "./Button";
import { selectFieldStyles } from "../../styles/styles";
import LottieAnimation from "./LottieAnimation";

const GET_ALL_TRIPS = gql`
  query GetAllTrips {
    trips {
      startLocation
      endLocation
      miles
      date
      weather
      vehicle {
        name
        _id
      }
    }
  }
`;

const TripPDFButton: React.FC = () => {
  const username = localStorage.getItem("username");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: vehicleData, loading: loadingVehicles } =
    useQuery(GET_VEHICLES);

  const {
    data: allTripsData,
    loading: loadingAllTrips,
    error: errorAllTrips,
  } = useQuery(GET_ALL_TRIPS, {
    skip: selectedVehicleId !== "",
  });

  const {
    data: filteredTripsData,
    loading: loadingFiltered,
    error: errorFiltered,
  } = useQuery(GET_TRIPS_BY_VEHICLE, {
    variables: { vehicleId: selectedVehicleId },
    skip: selectedVehicleId === "",
  });

  const trips =
    selectedVehicleId === ""
      ? allTripsData?.trips || []
      : filteredTripsData?.getTripsByVehicle || [];
  const loading = selectedVehicleId === "" ? loadingAllTrips : loadingFiltered;
  const error = selectedVehicleId === "" ? errorAllTrips : errorFiltered;

  const generatePDF = () => {
    // ... existing generatePDF logic remains unchanged ...
  };

  return (
    <div>
      <Card
        title={
          <div className="heading-xl text-center text-black">
            Trip Report Printer
          </div>
        }
      >
        <div className="flex justify-center w-full mb-6">
          <div className="bg-[color:var(--off-white)] bg-opacity-40 p-4 rounded-xl shadow-sm max-w-2xl w-full text-center">
            <div className="text-lg text-[color:var(--prussian)] space-y-2">
              <p>
                Choose a vehicle or select "All Vehicles" to generate a report.
              </p>
              <p>Optional: Set a start and end date to filter trips by date.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {loadingVehicles ? (
            <p>Loading vehicles...</p>
          ) : (
            <div className="w-full max-w-md flex flex-col text-sm font-semibold text-[color:var(--prussian)]">
              <label htmlFor="vehicleSelect" className="mb-1">
                Select a vehicle to generate your report:
              </label>
              <select
                id="vehicleSelect"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className={`${selectFieldStyles} w-full`}
              >
                <option value="">All Vehicles</option>
                {vehicleData?.vehicles.map((v: any) => (
                  <option key={v._id} value={v._id}>
                    {v.name} ({v.make} {v.vehicleModel})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <label className="flex flex-col text-sm font-semibold text-[color:var(--prussian)]">
              Start Date
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 bg-[color:var(--off-white)] border border-[color:var(--pink)] rounded-xl px-4 py-2 shadow-sm text-black w-full"
              />
            </label>

            <div className="flex flex-col text-sm font-semibold text-[color:var(--prussian)]">
              End Date
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 bg-[color:var(--off-white)] border border-[color:var(--pink)] rounded-xl px-4 py-2 shadow-sm text-black w-full"
                />
                <Button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="mt-1 bg-[color:var(--sky)] hover:bg-[color:var(--teal)] text-white px-3 py-1 rounded shadow"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading trips...</p>
          ) : error ? (
            <p className="text-red-600">Error loading trips.</p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 items-center w-full max-w-4xl">
              {/* PDF Buttons Section */}
              <div className="space-y-4 flex-1 w-full">
                <div className="bg-[color:var(--off-white)] border border-[color:var(--pink)] p-4 rounded-xl shadow flex items-center justify-between">
                  <span className="text-[color:var(--prussian)] font-semibold">
                    Download Trips within date range
                  </span>
                  <Button
                    onClick={generatePDF}
                    className="bg-[color:var(--orange)] hover:bg-[color:var(--yellow)] text-white px-4 py-2 rounded-xl shadow-md"
                  >
                    GET PDF
                  </Button>
                </div>
                <div className="bg-[color:var(--off-white)] border border-[color:var(--pink)] p-4 rounded-xl shadow flex items-center justify-between">
                  <span className="text-[color:var(--prussian)] font-semibold">
                    Download All Trips
                  </span>
                  <Button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      generatePDF();
                    }}
                    className="bg-[color:var(--teal)] hover:bg-[color:var(--sky)] text-white px-4 py-2 rounded-xl shadow-md"
                  >
                    GET PDF
                  </Button>
                </div>
              </div>

              {/* Lottie Animation Section */}
              <div className="w-full lg:w-1/3 flex justify-center">
                <LottieAnimation />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TripPDFButton;
