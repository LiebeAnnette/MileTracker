import React from "react";
import { useAuth } from '../context/AuthContext';
import "../../styles/navbar.css";

const Navbar: React.FC = () => {
    const { token, setToken } = useAuth();

    const handleLogout = () => {
        setToken(null);
    };

    return (
        <nav>
            <h2>MileTracker</h2>
            {token && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
};

export default Navbar;