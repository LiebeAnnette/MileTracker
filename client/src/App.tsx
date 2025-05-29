import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TripForm from "./components/TripForm";
import TripDashboard from "./components/TripDashboard";
import TripPDFButton from "./components/TripPDFButton";
import AuthForm from "./components/AuthForm";
//import LogoutButton from "./components/LogoutButton";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import VehicleManager from "./components/VehicleManager";
import MaintenanceAlerts from "./components/MaintenanceAlerts";
import ExpenseManager from "./components/ExpenseManager";
import Footer from "./components/Footer";

import Navbar from "./components/Navbar";


const App: React.FC = () => {
  const { token } = useAuth();

  return (
    <Router>
      <div>
        <Navbar />
        {!token ? (
          <AuthForm />
        ) : (
          <>
            <nav style={{ marginBottom: "1rem" }}>
              <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
              <Link to="/expenses">Trip Expenses</Link>
            </nav>

            <Routes>
              <Route
                path="/"
                element={
                  <div className="mainpage">
                    {/* <LogoutButton /> */}
                    <TripPDFButton />
                    <VehicleManager />
                    <MaintenanceAlerts />
                    <TripForm />
                    <TripDashboard />
                  </div>
               }
              />
              <Route path="/expenses" element={<ExpenseManager />} />
            </Routes>
          </>
        )}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
