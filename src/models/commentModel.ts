import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author'],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must have a post'],
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  depth: {
    type: Number,
    default: 1,
  },
  content: {
    type: String,
    required: [true, 'Comment must have a content'],
  },
});

commentSchema.set('timestamps', { createdAt: true, updatedAt: false });

export default mongoose.model('Comment', commentSchema);
