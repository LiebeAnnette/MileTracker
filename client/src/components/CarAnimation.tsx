import React from "react";
import "../../styles/CarAnimation.css";
const vehicles = ["🚗", "🚕", "🚙", "🛻", "🚐", "🚚", "🚛", "🏎️", "🚓"];

const CarAnimation: React.FC = () => {
  return (
    <div className="road-container">
      <div className="vehicle-parade">
        {vehicles.map((v, i) => (
          <span
            className="vehicle"
            key={i}
            style={{
              animationDelay: `${i * 2}s`, // smoother spacing
              animationDuration: `${10 + (i % 3)}s`, // slightly varied speeds
            }}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CarAnimation;
