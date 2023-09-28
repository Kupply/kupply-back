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
    default: Date.now(),
  },
  certificate: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Email', emailSchema);
