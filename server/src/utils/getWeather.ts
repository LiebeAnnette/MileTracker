import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface GeoLocation {
  lat: number;
  lon: number;
}

interface WeatherResponse {
  weather: {
    main: string;
  }[];
  main: {
    temp: number;
  };
}

export async function getWeather(location: string): Promise<string> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const geoRes = await axios.get<GeoLocation[]>(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: location,
          limit: 1,
          appid: apiKey,
        },
      }
    );

    if (!geoRes.data.length) {
      throw new Error(`No coordinates found for "${location}"`);
    }

    const { lat, lon } = geoRes.data[0];

    const weatherRes = await axios.get<WeatherResponse>(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: "imperial",
        },
      }
    );

    const weatherMain = weatherRes.data.weather[0].main;
    const temperature = weatherRes.data.main.temp;

    return `${weatherMain} ${temperature}°F`;
  } catch (error) {
    console.error("Error in getWeather:", error);
    throw new Error("Failed to fetch weather.");
  }
}
