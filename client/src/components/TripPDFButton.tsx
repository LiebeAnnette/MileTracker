import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import jsPDF from "jspdf";
import { GET_VEHICLES } from "../graphql/vehicleQueries";
import { GET_TRIPS_BY_VEHICLE } from "../graphql/tripQueries";
import Card from "./Card";
import Button from "./Button";
import { selectFieldStyles } from "../../styles/styles";
// import LottieAnimation from "./LottieAnimation";
import AnimationContainer from "./AnimationContainer";

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const username = localStorage.getItem("username") || "Anonymous";
    const email = localStorage.getItem("email") || username;

    const trips =
      selectedVehicleId === ""
        ? allTripsData?.trips || []
        : filteredTripsData?.getTripsByVehicle || [];

    const filteredTrips = trips.filter((trip: any) => {
      const tripTime = new Date(trip.date).getTime();

      const startOK = startDate
        ? tripTime >= new Date(startDate + "T00:00:00").getTime()
        : true;

      const endOK = endDate
        ? tripTime <= new Date(endDate + "T23:59:59.999").getTime()
        : true;

      return startOK && endOK;
    });

    // Group trips by vehicle
    const vehicleGroups: { [vehicleName: string]: any[] } = {};
    filteredTrips.forEach((trip: any) => {
      const name = trip.vehicle?.name || "Unknown Vehicle";
      if (!vehicleGroups[name]) vehicleGroups[name] = [];
      vehicleGroups[name].push(trip);
    });

    // COVER PAGE
    doc.setFontSize(18);
    doc.text(`MileTracker Trip Report for ${email}`, 14, 20);

    doc.setFontSize(12);
    const reportDate = new Date().toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });
    doc.text(`Generated: ${reportDate}`, 14, 30);

    const vehicleTitle =
      selectedVehicleId === ""
        ? "All Vehicles"
        : Object.keys(vehicleGroups)[0] || "Unknown Vehicle";
    doc.text(`Vehicle: ${vehicleTitle}`, 14, 38);

    const totalTrips = filteredTrips.length;
    const totalMiles = filteredTrips.reduce(
      (acc: number, trip: any) => acc + trip.miles,
      0
    );

    doc.text(`Total Trips: ${totalTrips}`, 14, 46);
    doc.text(`Total Miles: ${totalMiles.toFixed(2)}`, 14, 54);

    doc.text("Vehicle Breakdown:", 14, 64);

    let y = 72;
    for (const [vehicleName, trips] of Object.entries(vehicleGroups)) {
      const vehicleMiles = trips.reduce(
        (sum: number, t: any) => sum + t.miles,
        0
      );
      doc.text(
        `${vehicleName} — Trips: ${trips.length}, Miles: ${vehicleMiles.toFixed(
          2
        )}`,
        14,
        y
      );
      y += 8;
    }

    // PER VEHICLE SECTIONS
    for (const [vehicleName, trips] of Object.entries(vehicleGroups)) {
      doc.addPage();
      y = 20;

      const printPageHeader = () => {
        doc.setFontSize(14);
        doc.text(`Vehicle: ${vehicleName}`, 14, y);
        y += 10;
        doc.setFontSize(11);
      };

      printPageHeader();

      trips.forEach((trip: any, index: number) => {
        const tripDate = new Date(trip.date).toLocaleDateString();
        // const weather = trip.weather || "N/A";

        const lines = [
          `Trip ${index + 1}`,
          `From: ${trip.startLocation}`,
          `To: ${trip.endLocation}`,
          `Distance: ${trip.miles.toFixed(2)} miles`,
          `Date: ${tripDate}`,
        ];

        lines.forEach((line: string) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
            printPageHeader();
          }
          doc.text(line, 14, y);
          y += 8;
        });

        // Separator line
        doc.setDrawColor(150);
        doc.line(14, y, 195, y);
        y += 10;
      });
    }

    // PAGE NUMBERS
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
    }

    doc.save("trip_report.pdf");
  };

  const loading = selectedVehicleId === "" ? loadingAllTrips : loadingFiltered;
  const error = selectedVehicleId === "" ? errorAllTrips : errorFiltered;

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
              <p>Optional: Filter trips by Start/End dates.</p>
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

          <div className="flex flex-col sm:flex-row gap-4 items-start w-full max-w-md">
            <label className="flex flex-col text-sm font-semibold text-[color:var(--prussian)] w-full">
              Start Date
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 bg-[color:var(--off-white)] border border-[color:var(--pink)] rounded-xl px-4 py-2 shadow-sm text-black w-full"
              />
            </label>

            <label className="flex flex-col text-sm font-semibold text-[color:var(--prussian)] w-full">
              End Date
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 bg-[color:var(--off-white)] border border-[color:var(--pink)] rounded-xl px-4 py-2 shadow-sm text-black w-full"
              />
            </label>

            <div className="w-full sm:w-auto">
              <Button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="bg-[color:var(--sky)] hover:bg-[color:var(--teal)] text-white px-3 py-2 rounded-xl shadow w-full sm:w-auto"
              >
                Clear Dates
              </Button>
            </div>
          </div>

          {loading ? (
            <p>Loading trips...</p>
          ) : error ? (
            <p className="text-red-600">Error loading trips.</p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 items-center w-full max-w-4xl">
              <div className="space-y-4 w-full max-w-md">
                <div className="bg-[color:var(--off-white)] border border-[color:var(--pink)] p-4 rounded-xl shadow flex items-center justify-between">
                  <span className="text-[color:var(--prussian)] font-semibold">
                    Download Trips<br></br> within date range
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

              <AnimationContainer />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TripPDFButton;
