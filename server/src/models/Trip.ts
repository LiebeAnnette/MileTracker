import { Schema, model, Document, Types } from "mongoose";

export interface ITrip extends Document {
  startLocation: string;
  endLocation: string;
  miles: number;
  date: string;
  weather?: string;
  user: Types.ObjectId;
}

const tripSchema = new Schema<ITrip>({
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
  },
  miles: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Trip = model<ITrip>("Trip", tripSchema);

export default Trip;
