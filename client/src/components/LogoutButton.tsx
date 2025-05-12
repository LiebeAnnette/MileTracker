import React from "react";
import { useAuth } from "../context/AuthContext";

const LogoutButton: React.FC = () => {
  const { setToken } = useAuth();

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginBottom: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#ff6666",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
