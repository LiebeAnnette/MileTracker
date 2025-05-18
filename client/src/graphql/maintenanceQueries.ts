import { gql } from "@apollo/client";

export const GET_MAINTENANCE_ALERTS = gql`
  query GetMaintenanceAlerts {
    maintenanceAlerts {
      vehicleId
      vehicleName
      totalMiles
      threshold
      alert
    }
  }
`;
