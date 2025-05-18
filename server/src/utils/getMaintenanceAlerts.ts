import Trip from "../models/Trip";
import Vehicle from "../models/Vehicle";

export async function getVehiclesNeedingMaintenance(userId: string) {
  const vehicles = await Vehicle.find({ user: userId });
  const trips = await Trip.find({ user: userId });

  const mileageByVehicle: Record<string, number> = {};

  trips.forEach((trip) => {
    const vehicleId = trip.vehicle?.toString();
    if (vehicleId) {
      mileageByVehicle[vehicleId] =
        (mileageByVehicle[vehicleId] || 0) + trip.miles;
    }
  });

  return vehicles
    .map((vehicle) => {
      const totalMiles =
        mileageByVehicle[(vehicle._id as string).toString()] || 0;

      return {
        ...vehicle.toObject(),
        totalMiles,
      };
    })
    .filter(
      (vehicle) => vehicle.totalMiles >= vehicle.maintenanceReminderMiles
    );
}
