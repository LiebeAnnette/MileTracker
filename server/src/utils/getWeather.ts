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

interface CurrentWeatherResponse {
  weather: { main: string }[];
  main: { temp: number };
}

interface ForecastEntry {
  dt_txt: string;
  main: { temp: number };
  weather: { main: string }[];
}

interface ForecastWeatherResponse {
  list: ForecastEntry[];
}

// 🔹 Get coordinates using OpenRouteService
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
  if (!features?.length) {
    throw new Error(`No coordinates found for "${location}"`);
  }

  const [lon, lat] = features[0].geometry.coordinates;
  return [lat, lon]; // OpenWeather expects [lat, lon]
}

// 🔸 Main function with optional departure date
export async function getWeather(
  location: string,
  departureDate?: string
): Promise<string> {
  try {
    const [lat, lon] = await getCoordinatesFromOpenRoute(location);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const now = new Date();
    const tripDate = departureDate ? new Date(departureDate) : now;
    const isFuture =
      tripDate > now && tripDate.toDateString() !== now.toDateString();

    if (isFuture) {
      const forecastRes = await axios.get<ForecastWeatherResponse>(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            lat,
            lon,
            appid: apiKey,
            units: "imperial",
          },
        }
      );

      const target = new Date(tripDate);
      target.setHours(12, 0, 0, 0); // Midday target
      const targetTime = target.getTime();

      const closest = forecastRes.data.list.reduce(
        (bestMatch: ForecastEntry | null, entry) => {
          const entryTime = new Date(entry.dt_txt).getTime();
          const diff = Math.abs(entryTime - targetTime);
          const bestDiff = bestMatch
            ? Math.abs(new Date(bestMatch.dt_txt).getTime() - targetTime)
            : Infinity;
          return diff < bestDiff ? entry : bestMatch;
        },
        null
      );

      if (!closest || !closest.weather.length) {
        throw new Error("No forecast data available for that date");
      }

      const weather = closest.weather[0].main;
      const temp = closest.main.temp;
      return `${weather} ${temp.toFixed(2)}°F`;
    } else {
      const weatherRes = await axios.get<CurrentWeatherResponse>(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat,
            lon,
            units: "imperial",
            appid: apiKey,
          },
        }
      );

      const weather = weatherRes.data.weather[0].main;
      const temp = weatherRes.data.main.temp;
      return `${weather} ${temp.toFixed(2)}°F`;
    }
  } catch (error) {
    console.error("Error in getWeather:", error);
    throw new Error("Failed to fetch weather.");
  }
}
