import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

export interface IMajor {
  _id: Types.ObjectId;
  name: string;
  recruiting: number;
}

const majorSchema = new Schema<IMajor>({
  name: {
    type: String,
    required: true,
  },
  recruiting: Number,
});

export default mongoose.model<IMajor>('Major', majorSchema);
