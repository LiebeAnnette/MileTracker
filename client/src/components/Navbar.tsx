import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../../styles/navbar.css";

const Navbar: React.FC = () => {
  const { token, setToken } = useAuth();
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-header">
          <img
            src="/MileTrackerLogo-favicon.png"
            alt="MileTracker Logo"
            className="logo-icon"
          />
          <h2 className="nav-title">MileTracker</h2>
        </div>

        <div className="nav-status">
          <span className="text-sm font-medium text-white">
            {token ? "Logged in" : "Logged out"}
          </span>
        </div>

        {token && (
          <div className="nav-content">
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/vehicles">Vehicles</Link>
              <Link to="/add-trip">Add Trip</Link>
              <Link to="/trips">Your Trips</Link>
              <Link to="/alerts">Service Alerts</Link>
              <Link to="/pdf">PDF Generator</Link>
              <Link to="/expenses">Expense Manager</Link>
            </div>
            <div className="logout-container">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  // return (
  //     <nav>
  //         <h2>MileTracker</h2>
  //         {token && <button onClick={handleLogout}>Logout</button>}
  //     </nav>
  // );
};

export default Navbar;
