import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const majorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  recruiting: Number,
});

export default mongoose.model('Major', majorSchema);
