const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MajorSchema = new Schema({
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  recruiting_number: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Major', MajorSchema);
