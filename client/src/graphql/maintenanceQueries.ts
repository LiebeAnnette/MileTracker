import { gql } from "@apollo/client";

export const GET_ALERT_MESSAGES = gql`
  query GetAlertMessages {
    maintenanceAlerts {
      vehicleId
      vehicleName
      totalMiles
      threshold
      alert
    }
  }
`;
