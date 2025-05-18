import { Schema, model, Document, Types } from "mongoose";

export interface IVehicle extends Document {
  user: Types.ObjectId;
  name: string;
  make?: string;
  vehicleModel?: string;
  maintenanceReminderMiles: number;
}

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
  maintenanceReminderMiles: {
    type: Number,
    required: true,
    default: 5000,
  },
});

const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);
export default Vehicle;
