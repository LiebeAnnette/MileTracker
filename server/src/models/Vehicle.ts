import { Schema, model, Document, Types } from "mongoose";

export interface IMaintenanceReminder {
  name: string;
  mileage: number;
  lastResetMileage?: number;
}

export interface IVehicle extends Document {
  user: Types.ObjectId;
  name: string;
  make?: string;
  vehicleModel?: string;
  maintenanceReminders: IMaintenanceReminder[];
}

const maintenanceReminderSchema = new Schema<IMaintenanceReminder>({
  name: { type: String, required: true },
  mileage: { type: Number, required: true },
  lastResetMileage: { type: Number, default: 0 },
});

const vehicleSchema = new Schema<IVehicle>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  make: String,
  vehicleModel: String,
  maintenanceReminders: [maintenanceReminderSchema],
});

const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);
export default Vehicle;
