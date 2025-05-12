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
    }
  }
`;

const TripPDFButton: React.FC = () => {
  const { data, loading, error } = useQuery(GET_TRIPS);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Trip Report", 10, 10);

    let y = 20;
    data.trips.forEach((trip: any, index: number) => {
      doc.text(
        `${index + 1}. ${trip.startLocation} → ${trip.endLocation}, ${
          trip.miles
        } miles, ${trip.weather}, ${new Date(trip.date).toLocaleDateString()}`,
        10,
        y
      );
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("trip-report.pdf");
  };

  if (loading) return <p>Loading PDF button...</p>;
  if (error) return <p>Error loading trips for PDF.</p>;

  return (
    <button onClick={generatePDF} style={{ marginTop: "1rem" }}>
      Download Trip PDF
    </button>
  );
};

export default TripPDFButton;
