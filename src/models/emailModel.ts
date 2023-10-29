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
    default: function () {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 9);
      return currentTime;
    },
  },
  certificate: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Email', emailSchema);
