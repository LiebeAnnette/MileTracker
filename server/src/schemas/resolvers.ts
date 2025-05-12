import Trip from "../models/Trip";
import { calculateMiles } from "../utils/calculateMiles";
import { getWeather } from "../utils/getWeather";

const resolvers = {
  Query: {
    trips: async () => {
      return await Trip.find({});
    },
    totalMiles: async () => {
      const trips = await Trip.find({});
      return trips.reduce((total, trip) => total + trip.miles, 0);
    },
  },
  Mutation: {
    addTrip: async (_: any, { startLocation, endLocation }: any) => {
      const miles = await calculateMiles(startLocation, endLocation);
      const weather = await getWeather(endLocation);
      const date = new Date().toISOString();

      const newTrip = await Trip.create({
        startLocation,
        endLocation,
        miles,
        date,
        weather,
      });

      return newTrip;
    },
  },
};

export default resolvers;
