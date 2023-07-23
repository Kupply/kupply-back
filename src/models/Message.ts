const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MessageSchema = new Schema({
  _id: ObjectId,
  content: {
    type: String,
    required: true,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: ObjectId,
    ref: 'User',
  },
  receiver: {
    type: ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Message', MessageSchema);
