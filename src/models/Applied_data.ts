const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ApplyDataSchema = new Schema({
  _id: ObjectId,
  applied_major1: {
    type: ObjectId,
    ref: 'Major',
    required: true,
  },
  applied_major2: {
    type: ObjectId,
    ref: 'Major', //기억이 안 나면 안 적어도 되도록..
  },
  applied_semester: {
    type: String,
    required: true,
  },
  applied_times: {
    type: String,
    enum: ['Once', 'Over Two'],
    required: true,
  },
  applied_gpa: {
    type: Number,
    required: true,
  },
  applied_description: {
    type: String,
  },
});

export default mongoose.model('Applied_data', ApplyDataSchema);
