import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Report must have a reporter'],
  },
  suspect: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Report must have a suspect'],
  },
  createdAt: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
});

export default mongoose.model('Report', reportSchema);
