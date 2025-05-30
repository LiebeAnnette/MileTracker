import React from "react";
import Card from "./Card";
import CarAnimation from "./CarAnimation";

const Home: React.FC = () => {
  return (
    <Card>
      <div className="flex flex-col items-center space-y-6 text-center py-12 px-4 bg-gradient-to-b from-[color:var(--sky)] via-[color:var(--off-white)] to-transparent rounded-xl shadow-md">
        <h1
          className="text-4xl font-extrabold text-[color:var(--prussian)] drop-shadow-sm"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome to MileTracker
        </h1>
        <p
          className="text-base sm:text-lg text-[color:var(--prussian)] max-w-xl leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Your personal vehicle trip and mileage manager.
          <br />
          <span
            className="font-semibold animate-color-pulse"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Select a tab to get started.
          </span>
        </p>
      </div>

      <CarAnimation />
    </Card>
  );
};

export default Home;
