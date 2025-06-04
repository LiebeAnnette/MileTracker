import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface Park {
  fullName: string;
  description: string;
}

interface NPSResponse {
  data: Park[];
}

export async function getRandomParkFact(): Promise<string> {
  const apiKey = process.env.NPS_API_KEY;

  const response = await axios.get<NPSResponse>(
    "https://developer.nps.gov/api/v1/parks",
    {
      params: {
        limit: 50,
      },
      headers: {
        "X-Api-Key": apiKey,
      },
    }
  );

  const parks = response.data.data;

  if (!parks || parks.length === 0) {
    throw new Error("No parks found");
  }

  const randomIndex = Math.floor(Math.random() * parks.length);
  const park = parks[randomIndex];

  return `${park.fullName} — ${park.description}`;
}
