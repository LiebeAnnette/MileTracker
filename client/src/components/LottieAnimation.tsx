import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
const Lottie = lazy(() => import("lottie-react"));

import CarAnimation4 from "../assets/CarAnimation4.json";
import CarAnimation2 from "../assets/CarAnimation2.json";
import CarAnimation3 from "../assets/CarAnimation3.json";

const animations = [CarAnimation4, CarAnimation2, CarAnimation3];
const LOOPS_PER_ANIMATION = 3;

interface LottieAnimationProps {
  onAnimationCycleComplete?: () => void;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  onAnimationCycleComplete,
}) => {
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
          if (onAnimationCycleComplete) onAnimationCycleComplete(); // 🔥 call it!
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
      <div className="relative w-full py-6 h-52 rounded-xl shadow-inner overflow-hidden">
        <div
          key={currentIndex}
          className={`absolute inset-0 flex justify-center items-center transition-opacity duration-300 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center">
            <Lottie
              lottieRef={lottieRef}
              animationData={animations[currentIndex]}
              loop={false}
              onComplete={handleComplete}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LottieAnimation;
