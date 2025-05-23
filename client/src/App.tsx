import React from "react";
import TripForm from "./components/TripForm";
import TripDashboard from "./components/TripDashboard";
import TripPDFButton from "./components/TripPDFButton";
import AuthForm from "./components/AuthForm";
import LogoutButton from "./components/LogoutButton";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import VehicleManager from "./components/VehicleManager";
import MaintenanceAlerts from "./components/MaintenanceAlerts";

const App: React.FC = () => {
  const { token } = useAuth();

  return (
    <div>
      <h1>MileTracker</h1>
      {!token ? (
        <AuthForm />
      ) : (
        <div className="mainpage">
          <LogoutButton />
          <TripPDFButton />
          <VehicleManager />
          <MaintenanceAlerts />
          <TripForm />
          <TripDashboard />
        </div>
      )}
    </div>
  );
};

export default App;
