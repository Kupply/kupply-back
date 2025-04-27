import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

export interface IMajor {
  _id: Types.ObjectId;
  name: string; // 학과 한글 이름
  code: string; // 고파스 학과 코드
  collegeName: string; // 단과대 한글 이름
  shortEngName: string; // 학과 영문 약어
  longEngName: string; // 학과 영문 이름
  shortCollegeEngName: string; // 단과대 영문 약어
  interest: Number;
  imagesrc: string;
  filter: Array<string> | undefined;
  appliable: boolean;
}

const majorSchema = new Schema<IMajor>({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  collegeName: {
    type: String,
  },
  shortEngName: {
    type: String,
  },
  longEngName: {
    type: String,
  },
  shortCollegeEngName: {
    type: String,
  },
  interest: {
    type: Number,
    default: 0,
  },
  imagesrc: {
    type: String,
  },
  filter: {
    type: [String],
  },
  appliable: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IMajor>('Major', majorSchema);
