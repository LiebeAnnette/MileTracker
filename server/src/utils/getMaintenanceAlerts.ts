import Trip from "../models/Trip";
import Vehicle, { IMaintenanceReminder, IVehicle } from "../models/Vehicle";

export async function getVehiclesNeedingMaintenance(userId: string) {
  const vehicles = await Vehicle.find({ user: userId });
  const trips = await Trip.find({ user: userId });

  const mileageByVehicle: Record<string, number> = {};

  // 1. Sum total miles per vehicle (keep for PDF)
  trips.forEach((trip) => {
    const vehicleId = trip.vehicle?.toString();
    if (vehicleId) {
      mileageByVehicle[vehicleId] =
        (mileageByVehicle[vehicleId] || 0) + trip.miles;
    }
  });

  // 2. Map each vehicle and compute mileageSinceReset per reminder
  return vehicles.flatMap((vehicleDoc) => {
    const vehicle = vehicleDoc.toObject() as IVehicle & { _id: string };
    const vehicleId = vehicle._id.toString();
    const totalMiles = mileageByVehicle[vehicleId] || 0;

    // Go through each reminder and calculate if it's overdue
    const overdueReminders = vehicle.maintenanceReminders
      .map((reminder) => {
        const lastReset = reminder.lastResetMileage || 0;
        const milesSinceReset = totalMiles - lastReset;

        if (milesSinceReset >= reminder.mileage) {
          return {
            vehicleId,
            vehicleName: vehicle.name,
            reminderName: reminder.name,
            milesSinceReset,
            threshold: reminder.mileage,
            alert: `${vehicle.name} is due for ${
              reminder.name
            } — ${milesSinceReset.toFixed(
              2
            )} miles since last reset (limit: ${reminder.mileage.toFixed(2)}).`,
          };
        }

        return null;
      })
      .filter(Boolean);

    return overdueReminders;
  });
}
