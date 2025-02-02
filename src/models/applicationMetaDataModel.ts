import e from 'express';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const applyMetaDataSchema = new Schema({
  //전공
  major: {
    type: Schema.Types.ObjectId,
    ref: 'Major',
    required: true,
  },
  //학기
  semester: {
    type: String,
    required: true,
  },
  //해당 학기 예상 선발 인원
  expectedRecruitNumber: {
    type: Number,
    required: true,
  },
  // 해당 학기 실제 선발 인원
  recruitNumber: {
    type: Number,
  },
  // 해당 학기 모의지원자 수
  appliedNumber: {
    type: Number,
  },
  // 해당 학기 모의지원자 중 합격자 수
  passedNumber: {
    type: Number,
  },
  // 해당 학기 합격자 학점 평균값
  passedGPAavg: {
    type: Number,
    min: 0,
    max: 4.5,
  },
  //해당 학기 합격자 학점 중위값
  passedGPAmed: {
    type: Number,
    min: 0,
    max: 4.5,
  },
  // 해당 학기 합격자 학점 최빈값
  passedGPAmode: {
    type: Number,
    min: 0,
    max: 4.5,
  },
  // 해당 학기 합격자 학점 최저값
  passedGPAmin: {
    type: Number,
    min: 0,
    max: 4.5,
  },
});

export default mongoose.model('ApplyMetaData', applyMetaDataSchema);
