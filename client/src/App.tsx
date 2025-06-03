import React from "react";
//import { BrowserRouter as Router, Route, Link } from "react-router-dom";
//import {Routes} from "react-router";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ExpenseManager from "./components/ExpenseManager";

const App: React.FC = () => {
  const { token } = useAuth();

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
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/expenses" element={<ExpenseManager />} />
      </Routes>
      </div>
      <Footer />
      </div>
    </Router>
  );




//   return (
//     <div>
//       <Navbar />
//       {!token ? (
//         <AuthForm />
//       ) : (
//         <div className="mainpage">
//           {/* <LogoutButton /> */}
//           <TripPDFButton />
//           <VehicleManager />
//           <MaintenanceAlerts />
//           <TripForm />
//           <TripDashboard />
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
 };

export default App;
