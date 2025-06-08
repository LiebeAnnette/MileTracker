import { useEffect } from "react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

interface GoogleMapsScriptLoaderProps {
  onLoad: () => void;
}

const GoogleMapsScriptLoader: React.FC<GoogleMapsScriptLoaderProps> = ({ onLoad }) => {
  useEffect(() => {
    if (window.google) {
      onLoad(); 
      return;
    }

    if (document.getElementById("google-maps-script")) {
      // If script already exists but not yet loaded, add onload
      const script = document.getElementById("google-maps-script") as HTMLScriptElement;
      script.onload = onLoad;
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = onLoad;
    document.head.appendChild(script);
  }, [onLoad]);

  return null;
};

export default GoogleMapsScriptLoader;