import { Schema, model, Document } from "mongoose";

export interface ITrip extends Document {
  startLocation: string;
  endLocation: string;
  miles: number;
  date: string;
  weather?: string;
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
});

const Trip = model<ITrip>("Trip", tripSchema);

export default Trip;
