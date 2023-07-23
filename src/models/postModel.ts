import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have a user ID.'],
    },
    category: {
      type: String,
      required: [true, 'Post must have a category.'],
    },
    title: {
      type: String,
      required: [true, 'Post must have a title.'],
    },
    content: {
      type: String,
      required: [true, 'Post must have a content.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

postSchema.set('timestamps', { createdAt: true, updatedAt: false });

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

export default mongoose.model('Post', postSchema);
