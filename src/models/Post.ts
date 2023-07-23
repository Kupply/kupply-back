const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
  _id: ObjectId,
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  modify_date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: ObjectId,
    ref: 'User',
  },
  major: {
    type: ObjectId,
    ref: 'Major',
  },//어짜피 학과별 채팅방이니 category 대신 major로!
  parent: this
});

export default mongoose.model('Post', PostSchema);
