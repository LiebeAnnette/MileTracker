import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface ORSGeoResponse {
  features: {
    geometry: {
      coordinates: [number, number]; // [lon, lat]
    };
  }[];
}

interface WeatherResponse {
  weather: {
    main: string;
  }[];
  main: {
    temp: number;
  };
}

async function getCoordinatesFromOpenRoute(
  location: string
): Promise<[number, number]> {
  const apiKey = process.env.ORS_API_KEY;

  const res = await axios.get<ORSGeoResponse>(
    "https://api.openrouteservice.org/geocode/search",
    {
      params: {
        api_key: apiKey,
        text: location,
        size: 1,
      },
    }
  );

  const features = res.data.features;
  if (!features || !features.length) {
    throw new Error(`No coordinates found for "${location}"`);
  }

  const [lon, lat] = features[0].geometry.coordinates;
  return [lat, lon]; // OpenWeather expects [lat, lon]
}

export async function getWeather(location: string): Promise<string> {
  try {
    const [lat, lon] = await getCoordinatesFromOpenRoute(location);
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

    const weatherRes = await axios.get<WeatherResponse>(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          units: "imperial",
          appid: openWeatherApiKey,
        },
      }
    );

    const weather = weatherRes.data.weather[0].main;
    const temp = weatherRes.data.main.temp;

    return `${weather} ${temp.toFixed(2)}°F`;
  } catch (error) {
    console.error("Error in getWeather:", error);
    throw new Error("Failed to fetch weather.");
  }
}
