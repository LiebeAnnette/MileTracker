import React from "react";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import {Routes} from "react-router";
import TripForm from "./components/TripForm";
import TripDashboard from "./components/TripDashboard";
import TripPDFButton from "./components/TripPDFButton";
import AuthForm from "./components/AuthForm";
 // import LogoutButton from "./components/LogoutButton";
import { useAuth } from "./context/AuthContext";
import VehicleManager from "./components/VehicleManager";
import MaintenanceAlerts from "./components/MaintenanceAlerts";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const { token } = useAuth();

  return (
    <div>
      <Navbar />
      {!token ? (
        <AuthForm />
      ) : (
        <div className="mainpage">
          {/* <LogoutButton /> */}
          <TripPDFButton />
          <VehicleManager />
          <MaintenanceAlerts />
          <TripForm />
          <TripDashboard />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;
