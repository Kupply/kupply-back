import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

export interface IMajor {
  _id: Types.ObjectId;
  name: string;
  engName: string;
  interest: Number;
  imagesrc: string;
}

const majorSchema = new Schema<IMajor>({
  name: {
    type: String,
    required: true,
  },
  engName: {
    type: String,
  },
  interest: {
    type: Number,
    default: 0,
  },
  imagesrc: {
    type: String,
  }
});

export default mongoose.model<IMajor>('Major', majorSchema);
