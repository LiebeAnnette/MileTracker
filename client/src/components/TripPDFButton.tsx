import React from "react";
import { gql, useQuery } from "@apollo/client";
import jsPDF from "jspdf";

const GET_TRIPS = gql`
  query GetTrips {
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
  const { data, loading, error } = useQuery(GET_TRIPS);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("MileTracker Trip Report", 10, 15);

    doc.setFontSize(12);
    let y = 30;

    data.trips.forEach((trip: any, index: number) => {
      doc.setTextColor(0);
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

      // Draw separator
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

  if (loading) return <p>Loading PDF...</p>;
  if (error) return <p>Error loading trips.</p>;

  return (
    <button onClick={generatePDF} style={{ marginTop: "1rem" }}>
      Download Trip PDF
    </button>
  );
};

export default TripPDFButton;
