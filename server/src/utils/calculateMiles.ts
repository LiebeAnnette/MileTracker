import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface GeoLocation {
  lat: number;
  lon: number;
}

interface OpenRouteResponse {
  routes: {
    summary: {
      distance: number;
    };
  }[];
}

async function getCoordinates(location: string): Promise<[number, number]> {
  const geoRes = await axios.get<GeoLocation[]>(
    "https://api.openweathermap.org/geo/1.0/direct",
    {
      params: {
        q: location,
        limit: 1,
        appid: process.env.OPENWEATHER_API_KEY,
      },
    }
  );

  if (!geoRes.data.length) {
    throw new Error(`No coordinates found for "${location}"`);
  }

  const { lat, lon } = geoRes.data[0];
  return [lon, lat]; // Note: OpenRouteService requires [lon, lat]
}

export async function calculateMiles(
  start: string,
  end: string
): Promise<number> {
  try {
    const apiKey = process.env.ORS_API_KEY;
    const url = "https://api.openrouteservice.org/v2/directions/driving-car";

    const startCoords = await getCoordinates(start);
    const endCoords = await getCoordinates(end);

    const response = await axios.post<OpenRouteResponse>(
      url,
      {
        coordinates: [startCoords, endCoords],
      },
      {
        headers: {
          Authorization: apiKey!,
          "Content-Type": "application/json",
        },
      }
    );

    const distanceInMeters = response.data.routes[0].summary.distance;
    const distanceInMiles = distanceInMeters / 1609.34;
    return parseFloat(distanceInMiles.toFixed(2));
  } catch (error) {
    console.error("Error in calculateMiles:", error);
    throw new Error("Failed to calculate mileage.");
  }
}
