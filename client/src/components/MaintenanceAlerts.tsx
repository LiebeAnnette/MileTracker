import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_MAINTENANCE_ALERTS = gql`
  query GetMaintenanceAlerts {
    maintenanceAlerts {
      _id
      name
      make
      vehicleModel
      maintenanceReminderMiles
    }
  }
`;

const MaintenanceAlerts: React.FC = () => {
  const { data, loading, error } = useQuery(GET_MAINTENANCE_ALERTS);

  if (loading) return <p>Checking maintenance...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data.maintenanceAlerts.length === 0) {
    return <p>All vehicles are under maintenance thresholds.</p>;
  }

  return (
    <div>
      <h3>🔧 Maintenance Needed</h3>
      <ul>
        {data.maintenanceAlerts.map((v: any) => (
          <li key={v._id}>
            {v.name} ({v.make} {v.vehicleModel}) — Exceeded{" "}
            {v.maintenanceReminderMiles} miles
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceAlerts;
