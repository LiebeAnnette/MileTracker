import Trip from "../models/Trip";
import Vehicle, { IMaintenanceReminder, IVehicle } from "../models/Vehicle";

export async function getVehiclesNeedingMaintenance(userId: string) {
  const vehicles = await Vehicle.find({ user: userId });
  const trips = await Trip.find({ user: userId });

  const mileageByVehicle: Record<string, number> = {};

  // Calculate total miles for each vehicle
  trips.forEach((trip) => {
    const vehicleId = trip.vehicle?.toString();
    if (vehicleId) {
      mileageByVehicle[vehicleId] =
        (mileageByVehicle[vehicleId] || 0) + trip.miles;
    }
  });

  // Return vehicles with at least one overdue maintenance reminder
  return vehicles
    .map((vehicleDoc) => {
      const vehicle = vehicleDoc.toObject() as IVehicle & { _id: string };
      const totalMiles = mileageByVehicle[vehicle._id.toString()] || 0;

      return {
        ...vehicle,
        totalMiles,
      };
    })
    .filter((vehicle) =>
      vehicle.maintenanceReminders?.some((reminder: IMaintenanceReminder) => {
        const lastReset = reminder.lastResetMileage || 0;
        return vehicle.totalMiles >= lastReset + reminder.mileage;
      })
    );
}
