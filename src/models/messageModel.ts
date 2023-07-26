import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a sender'],
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a receiver'],
  },
  content: {
    type: String,
    required: [true, 'Message must have a content'],
  },
});

messageSchema.set('timestamps', { createdAt: true, updatedAt: false });

export default mongoose.model('Message', messageSchema);
