// src/components/MaintenanceAlerts.tsx
import React from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import { GET_ALERT_MESSAGES } from "../graphql/maintenanceQueries";

const MaintenanceAlerts: React.FC = () => {
  const { token } = useAuth();

  const { data, loading, error } = useQuery(GET_ALERT_MESSAGES, {
    skip: !token,
  });

  if (!token) return null;
  if (loading) return <p>Checking maintenance...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data.maintenanceAlerts.length === 0) {
    return <p>All vehicles are under maintenance thresholds.</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        padding: "1rem",
        marginBottom: "1rem",
        border: "1px solid #ffeeba",
        borderRadius: "4px",
      }}
    >
      <h3>🔧 Maintenance Needed</h3>
      <ul>
        {data.maintenanceAlerts.map((v: any) => (
          <li key={v.vehicleId}>{v.alert}</li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceAlerts;
