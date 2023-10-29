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
    //해당 학기 모집 정원
    recruitNumber: {
      type: Number,
      required: true,
    },
    //해당 학기 지원한 사람 수
    appliedNumber: {
      type: Number,
    },
    //해당 학기 합격자 학점평균
    passedGPAavg: {
      type: Number,
      min: 0,
      max: 4.5,
    },
    //해당학기 합격자 학점 최솟값
    passedGPAmin: {
      type: Number,
      min: 0,
      max: 4.5,
    }
});

export default mongoose.model('ApplyMetaData', applyMetaDataSchema);