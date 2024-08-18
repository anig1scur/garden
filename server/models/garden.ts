import mongoose, { Document, Schema } from 'mongoose';

interface IBox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  href: string;
  bgColor: string;
  color: string;
  desc: string;
  className: string;
}

interface IGarden extends Document {
  id: string;
  boxes: IBox[];
}

const BoxSchema = new Schema<IBox>({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  text: String,
  href: String,
  bgColor: String,
  color: String,
  desc: String,
  className: String,
});

const GardenSchema = new Schema<IGarden>({
  id: { type: String, unique: true },
  boxes: [BoxSchema],
});

export default mongoose.model<IGarden>('Garden', GardenSchema);
