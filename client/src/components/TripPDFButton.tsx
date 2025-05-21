import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import jsPDF from "jspdf";
import { GET_VEHICLES } from "../graphql/vehicleQueries";
import { GET_TRIPS_BY_VEHICLE } from "../graphql/tripQueries";

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
      }
    }
  }
`;

const TripPDFButton: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  // Vehicles for dropdown
  const { data: vehicleData, loading: loadingVehicles } =
    useQuery(GET_VEHICLES);

  // Fetch all trips if "All Vehicles" is selected
  const {
    data: allTripsData,
    loading: loadingAllTrips,
    error: errorAllTrips,
  } = useQuery(GET_ALL_TRIPS, {
    skip: selectedVehicleId !== "", // only run if "All Vehicles" is selected
  });

  // Fetch trips for specific vehicle
  const {
    data: filteredTripsData,
    loading: loadingFiltered,
    error: errorFiltered,
  } = useQuery(GET_TRIPS_BY_VEHICLE, {
    variables: { vehicleId: selectedVehicleId },
    skip: selectedVehicleId === "", // skip if showing all
  });

  const trips =
    selectedVehicleId === ""
      ? allTripsData?.trips
      : filteredTripsData?.getTripsByVehicle;
  const loading = selectedVehicleId === "" ? loadingAllTrips : loadingFiltered;
  const error = selectedVehicleId === "" ? errorAllTrips : errorFiltered;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("MileTracker Trip Report", 10, 15);

    doc.setFontSize(12);
    let y = 30;

    trips.forEach((trip: any, index: number) => {
      doc.text(`Trip ${index + 1}`, 10, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(`From: ${trip.startLocation}`, 10, y);
      y += 5;
      doc.text(`To: ${trip.endLocation}`, 10, y);
      y += 5;
      doc.text(`Distance: ${trip.miles.toFixed(2)} miles`, 10, y);
      y += 5;
      doc.text(`Date: ${new Date(trip.date).toLocaleDateString()}`, 10, y);
      y += 5;
      doc.text(`Weather: ${trip.weather}`, 10, y);
      y += 5;
      doc.text(`Vehicle: ${trip.vehicle?.name || "N/A"}`, 10, y);
      y += 7;

      doc.setDrawColor(180);
      doc.line(10, y, 200, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
    });

    doc.save("trip-report.pdf");
  };

  return (
    <div>
      <h3>Export Trips by Vehicle</h3>

      {loadingVehicles ? (
        <p>Loading vehicles...</p>
      ) : (
        <select
          value={selectedVehicleId}
          onChange={(e) => setSelectedVehicleId(e.target.value)}
        >
          <option value="">All Vehicles</option>
          {vehicleData?.vehicles.map((v: any) => (
            <option key={v._id} value={v._id}>
              {v.name} ({v.make} {v.vehicleModel})
            </option>
          ))}
        </select>
      )}

      {loading ? (
        <p>Loading trips...</p>
      ) : error ? (
        <p>Error loading trips.</p>
      ) : (
        <button onClick={generatePDF} style={{ marginTop: "1rem" }}>
          Download Trip PDF
        </button>
      )}
    </div>
  );
};

export default TripPDFButton;
