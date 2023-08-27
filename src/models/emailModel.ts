import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const emailSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@korea\.ac\.kr$/,
  },
  code: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now() + 9 * 60 * 60 * 1000,
  },
  certificate: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Email', emailSchema);
