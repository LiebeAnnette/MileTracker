import Trip from "../models/Trip";
import User, { IUser } from "../models/User";
import { calculateMiles } from "../utils/calculateMiles";
import { getWeather } from "../utils/getWeather";
import { signToken } from "../utils/auth";

const resolvers = {
  Query: {
    trips: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return await Trip.find({ user: context.user._id });
    },

    totalMiles: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      const trips = await Trip.find({ user: context.user._id });
      return trips.reduce((total, trip) => total + trip.miles, 0);
    },

    me: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return await User.findById(context.user._id);
    },
  },

  Mutation: {
    register: async (_: any, { username, password }: any) => {
      const existing = await User.findOne({ username });
      if (existing) {
        throw new Error("Username already exists");
      }

      const user = (await User.create({ username, password })) as IUser;
      const token = signToken({
        _id: user._id as string,
        username: user.username,
      });

      return { token, user };
    },

    login: async (_: any, { username, password }: any) => {
      const user = (await User.findOne({ username })) as IUser;
      if (!user) {
        throw new Error("User not found");
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error("Incorrect password");
      }

      const token = signToken({
        _id: user._id as string,
        username: user.username,
      });

      return { token, user };
    },

    addTrip: async (
      _: any,
      { startLocation, endLocation }: any,
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const miles = await calculateMiles(startLocation, endLocation);
      const weather = await getWeather(endLocation);
      const date = new Date().toISOString();

      const newTrip = await Trip.create({
        startLocation,
        endLocation,
        miles,
        date,
        weather,
        user: context.user._id,
      });

      return newTrip;
    },
  },
};

export default resolvers;
