import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
const Lottie = lazy(() => import("lottie-react"));

import CarAnimation4 from "../assets/CarAnimation4.json";
import CarAnimation2 from "../assets/CarAnimation2.json";
import CarAnimation3 from "../assets/CarAnimation3.json";

const animations = [CarAnimation4, CarAnimation2, CarAnimation3];
const LOOPS_PER_ANIMATION = 3;

const LottieAnimation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, [currentIndex, loopCount]);

  const handleComplete = () => {
    setLoopCount((prev) => {
      if (prev + 1 >= LOOPS_PER_ANIMATION) {
        setIsFading(true); // Begin fade
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % animations.length);
          setLoopCount(0);
          setIsFading(false); // End fade
        }, 300); // Match the CSS fade duration
        return 0;
      } else {
        if (lottieRef.current) {
          lottieRef.current.stop();
          lottieRef.current.play();
        }
        return prev + 1;
      }
    });
  };

  return (
    <Suspense fallback={<div>Loading animation...</div>}>
      <div className="relative w-full py-6 h-52 bg-[color:var(--off-white)] rounded-xl shadow-inner overflow-hidden">
        <div
          key={currentIndex}
          className={`absolute inset-0 flex justify-center items-center transition-opacity duration-300 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-64 h-64 sm:w-80 sm:h-80">
            <Lottie
              lottieRef={lottieRef}
              animationData={animations[currentIndex]}
              loop={false}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LottieAnimation;
