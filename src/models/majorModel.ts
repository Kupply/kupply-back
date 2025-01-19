import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

export interface IMajor {
  _id: Types.ObjectId;
  name: string;
  recruiting: Number;
  imagesrc: string;
  appliable: boolean;
  collegeName: String;
  filter: Array<String>;
  interest: Number;
  longEngName: String;
  shortEngName: String;
  //engName: string;
}

const majorSchema = new Schema<IMajor>({
  name: {
    type: String,
    required: true,
  },
  recruiting: {
    type: Number,
    default: 0
  },
  imagesrc: {
    type: String,
  },
  appliable: {
    type: Boolean
  },
  collegeName: {
    type: String
  },
  filter: {
    type: [String]
  },
  interest: {
    type: Number,
    default: 0,
  },
  longEngName: {
    type: String
  },
  shortEngName: {
    type: String
  }
  // engName: {
  //   type: String,
  // },
});

export default mongoose.model<IMajor>('Major', majorSchema);
