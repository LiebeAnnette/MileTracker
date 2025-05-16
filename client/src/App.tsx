import React from "react";
import TripForm from "./components/TripForm";
import TripDashboard from "./components/TripDashboard";
import TripPDFButton from "./components/TripPDFButton";
import AuthForm from "./components/AuthForm";
import LogoutButton from "./components/LogoutButton";
import { useAuth } from "./context/AuthContext";
// import './App.css';

const App: React.FC = () => {
  const { token } = useAuth();

  return (
    <div>
      <h1>MileTracker</h1>
      {!token ? (
        <AuthForm />
      ) : (
        <>
          <LogoutButton />
          <TripPDFButton />
          <TripForm />
          <TripDashboard />
        </>
      )}
    </div>
  );
};

export default App;
