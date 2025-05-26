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
        _id
      }
    }
  }
`;

const TripPDFButton: React.FC = () => {
  const username = localStorage.getItem("username"); // ✅ Username from localStorage
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

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
    const doc = new jsPDF();
    const now = new Date();
    const localDateTime = now.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (selectedVehicleId === "") {
      const grouped: Record<string, { trips: any[]; totalMiles: number }> = {};
      let totalMilesAll = 0;

      trips.forEach((trip: any) => {
        const name = trip.vehicle?.name || "Unknown Vehicle";
        if (!grouped[name]) {
          grouped[name] = { trips: [], totalMiles: 0 };
        }
        grouped[name].trips.push(trip);
        grouped[name].totalMiles += trip.miles;
        totalMilesAll += trip.miles;
      });

      const totalTrips = trips.length;

      doc.setFontSize(16);
      doc.text(`MileTracker Trip Report for ${username || "User"}`, 10, 15);
      doc.setFontSize(12);
      doc.text("Vehicle: All Vehicles", 10, 22);
      doc.text(`Generated: ${localDateTime}`, 10, 28);
      doc.text(`Total Trips: ${totalTrips}`, 10, 36);
      doc.text(
        `Total Miles: ${totalMilesAll.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        10,
        42
      );

      let y = 52;
      doc.setFontSize(13);
      doc.text("Vehicle Breakdown:", 10, y);
      y += 6;

      Object.entries(grouped).forEach(
        ([vehicleName, { trips, totalMiles }]) => {
          doc.setFontSize(11);
          doc.text(
            `${vehicleName} — Trips: ${
              trips.length
            }, Miles: ${totalMiles.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            10,
            y
          );
          y += 6;
        }
      );

      Object.entries(grouped).forEach(([vehicleName, { trips }]) => {
        doc.addPage();
        let y = 20;

        doc.setFontSize(14);
        doc.text(`Vehicle: ${vehicleName}`, 10, y);
        y += 10;

        trips.forEach((trip: any, index: number) => {
          doc.setFontSize(12);
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
          y += 7;

          doc.setDrawColor(180);
          doc.line(10, y, 200, y);
          y += 10;

          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      });
    } else {
      const vehicleName =
        vehicleData?.vehicles.find((v: any) => v._id === selectedVehicleId)
          ?.name || "Selected Vehicle";

      doc.setFontSize(16);
      doc.text("MileTracker Trip Report", 10, 15);
      doc.setFontSize(12);
      doc.text(`Vehicle: ${vehicleName}`, 10, 22);
      doc.text(`Generated: ${localDateTime}`, 10, 28);

      const totalMiles = trips.reduce(
        (sum: number, trip: any) => sum + trip.miles,
        0
      );
      let y = 34;
      doc.text(`Total Trips: ${trips.length}`, 10, y);
      y += 6;
      doc.text(
        `Total Miles: ${totalMiles.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        10,
        y
      );
      y += 10;

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
    }

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
