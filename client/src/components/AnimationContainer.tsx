import React, { useState, useEffect } from "react";
import LottieAnimation from "./LottieAnimation";

const backgrounds = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
  "/image5.jpg",
  "/image6.png",
  "/image7.jpg",
  "/image8.jpg",
  "/image9.png",
  "/image10.jpg",
];

const AnimationContainer: React.FC = () => {
  const [bgIndex, setBgIndex] = useState(0);

  // Rotate background every 8 seconds (independent of animation)
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * backgrounds.length);
        } while (next === prev); // Avoid repeating the same image
        return next;
      });
    }, 8000); // 8000ms = 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="relative w-full h-48 rounded-xl overflow-hidden shadow">
        {/* Background layer */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-2000"
          style={{
            backgroundImage: `url('${backgrounds[bgIndex]}')`,
            backgroundColor: "#ccc",
          }}
        />

        {/* Animation layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center">
            <LottieAnimation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationContainer;
