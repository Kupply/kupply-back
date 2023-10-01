import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Report must have a reporter'],
  },
  suspectPost: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Report must have a suspect post'],
  },
});

export default mongoose.model('Report', reportSchema);
