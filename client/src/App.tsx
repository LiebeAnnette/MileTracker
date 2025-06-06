import React, { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import TripForm from "./components/TripForm";
import TripDashboard from "./components/TripDashboard";
import TripPDFButton from "./components/TripPDFButton";
import AuthForm from "./components/AuthForm";
import VehicleManager from "./components/VehicleManager";
import MaintenanceAlerts from "./components/MaintenanceAlerts";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ExpenseManager from "./components/ExpenseManager";
import { useAuth } from "./context/AuthContext";

// TODO: change to 30
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes
// const INACTIVITY_LIMIT = 5000; // 5 seconds FOR TESTING

const App: React.FC = () => {
  const { token, setToken } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    alert("You were logged out due to inactivity.\nPlease login again.");
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    if (!token) return;

    resetTimer(); // set timer on login

    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [token]);

  if (!token) {
    return <AuthForm />;
  }

  return (
    <Router>
      <div className="mainpage">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<TripDashboard />} />
            <Route path="/add-trip" element={<TripForm />} />
            <Route path="/vehicles" element={<VehicleManager />} />
            <Route path="/alerts" element={<MaintenanceAlerts />} />
            <Route path="/pdf" element={<TripPDFButton />} />
            <Route path="/expenses" element={<ExpenseManager />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
