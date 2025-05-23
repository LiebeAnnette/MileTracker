import Trip from "../models/Trip";
import User, { IUser } from "../models/User";
import { calculateMiles } from "../utils/calculateMiles";
import { getWeather } from "../utils/getWeather";
import { signToken } from "../utils/auth";
import Vehicle from "../models/Vehicle";
import { getVehiclesNeedingMaintenance } from "../utils/getMaintenanceAlerts";

const resolvers = {
  Query: {
    trips: async (_: any, args: { vehicleId?: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      const filter: any = { user: context.user._id };
      if (args.vehicleId) {
        filter.vehicle = args.vehicleId;
      }

      return await Trip.find(filter);
    },

    totalMiles: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      const trips = await Trip.find({ user: context.user._id });
      return trips.reduce((total, trip) => total + trip.miles, 0);
    },

    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return await User.findById(context.user._id);
    },

    vehicles: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return await Vehicle.find({ user: context.user._id });
    },
    maintenanceAlerts: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      const alerts = await getVehiclesNeedingMaintenance(
        context.user._id.toString()
      );

      return alerts.map((vehicle: any) => {
        const totalMiles = vehicle.totalMiles || 0;
        const threshold = vehicle.maintenanceReminderMiles;

        const formattedMiles = totalMiles.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const formattedThreshold = threshold.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return {
          vehicleId: vehicle._id.toString(),
          vehicleName: vehicle.name,
          totalMiles,
          threshold,
          alert: `${vehicle.name} has reached ${formattedMiles} miles and needs maintenance (limit: ${formattedThreshold}).`,
        };
      });
    },
    getTripsByVehicle: async (_: any, { vehicleId }: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return await Trip.find({
        user: context.user._id,
        vehicle: vehicleId,
      });
    },
  },

  Mutation: {
    register: async (_: any, { username, password }: any) => {
      const existing = await User.findOne({ username });
      if (existing) throw new Error("Username already exists");

      const user = (await User.create({ username, password })) as IUser;
      const token = signToken({
        _id: user._id as string,
        username: user.username,
      });

      return { token, user };
    },

    login: async (_: any, { username, password }: any) => {
      const user = (await User.findOne({ username })) as IUser;
      if (!user) throw new Error("User not found");

      const isValid = await user.comparePassword(password);
      if (!isValid) throw new Error("Incorrect password");

      const token = signToken({
        _id: user._id as string,
        username: user.username,
      });

      return { token, user };
    },

    addTrip: async (
      _: any,
      { startLocation, endLocation, vehicleId, departureDate }: any,
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");
      console.log("Start location:", startLocation);
      console.log("End location:", endLocation);

      const miles = await calculateMiles(startLocation, endLocation);
      const weather = await getWeather(endLocation, departureDate);
      const date = departureDate;

      const newTrip = await Trip.create({
        startLocation,
        endLocation,
        miles,
        date,
        weather,
        user: context.user._id,
        vehicle: vehicleId,
      });

      return newTrip;
    },

    deleteTrip: async (_: any, { _id }: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      const deleted = await Trip.findOneAndDelete({
        _id,
        user: context.user._id,
      });

      if (!deleted) throw new Error("Trip not found or unauthorized");

      return deleted;
    },

    addVehicle: async (
      _: any,
      { name, make, vehicleModel, maintenanceReminderMiles }: any,
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      return await Vehicle.create({
        user: context.user._id,
        name,
        make,
        vehicleModel,
        maintenanceReminderMiles,
      });
    },
    deleteVehicle: async (_: any, { _id }: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const deleted = await Vehicle.findOneAndDelete({
        _id,
        user: context.user._id,
      });

      if (!deleted) {
        throw new Error("Vehicle not found or unauthorized");
      }

      return deleted;
    },
    updateVehicle: async (
      _: any,
      { _id, name, maintenanceReminderMiles }: any,
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const update: any = {};
      if (name !== undefined) update.name = name;
      if (maintenanceReminderMiles !== undefined)
        update.maintenanceReminderMiles = maintenanceReminderMiles;

      const updatedVehicle = await Vehicle.findOneAndUpdate(
        { _id, user: context.user._id },
        update,
        { new: true }
      );

      if (!updatedVehicle) throw new Error("Vehicle not found or unauthorized");
      return updatedVehicle;
    },
  },

  Trip: {
    vehicle: async (parent: any) => {
      return await Vehicle.findById(parent.vehicle);
    },
  },
};

export default resolvers;
