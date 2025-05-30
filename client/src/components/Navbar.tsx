import React from "react";
import { Link } from "react-router-dom";
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
        {token && (
            <>
            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/vehicles">Vehicles</Link>
                <Link to="/trips">Trips</Link>
                <Link to="/add-trip">Add Trip</Link>
                <Link to="/alerts">Alerts</Link>
                <Link to="/pdf">Generate PDF</Link>
                </div>
                
                <div className="logout-container">
                    <button onClick={handleLogout}>Logout</button>
            </div>
        </>
    )}
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