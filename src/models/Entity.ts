const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const SECOND_DEPARTMENT = ['경영학과','건축사회환경공학부','전기전자공학부','산업경영공학부','화공생명공학과','신소재공학부','경제학과','정치외교학과','통계학과','데이터과학과','컴퓨터학과','국제학부','미디어학부','심리학부'];
export const PASS_SEMESTER =  ['2017-1', '2017-2', '2018-1', '2018-2', '2019-1', '2019-2', '2020-1', '2020-2', '2021-1', '2021-2', '2022-1', '2022-2', '2023-1', '2023-2','2024-1', '2024-2'];

const ApplicationSchema = new Schema({
    _id: {
      type: ObjectId,
      required: true,
    },
    applied_major1: {
      type: String,
      enum: SECOND_DEPARTMENT,
    },
    applied_major2: {
      type: String,
      enum: SECOND_DEPARTMENT,
    },
    apply_semester: Number,
    apply_times: Number,
    application_description: String,
});

const PostSchema = new Schema({
    _id: {
      type: ObjectId,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: String,
    content: String,
    date: Number
});
  
const MessageSchema = new Schema({
    _id: {
      type: ObjectId,
      required: true,
    },
    title: String,
    content: String,
    date: Number,
});

const MajorSchema = new Schema({
    _id: {
      type: ObjectId,
      required: true,
    },
    recuriting: Number,
    first_department: String,
    second_department: {
      type: String,
      enum: SECOND_DEPARTMENT,
    },
});

const UserSchema = new Schema({
  _id: {
    type: ObjectId,
    required: true,
  },
  email: {
    type: String,
    match: /^\w+@korea\.ac\.kr$/,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  student_id: {
    type: Number,
    maxlength: 10,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nickname: String,
  gpa: {
    type: Number,
    min: 0.0,
    max: 4.5,
    get: (value: number) => Math.round(value * 100) / 100,
    set: (value: number) => Math.round(value * 100) / 100,
  },
  first_major: {
    type: String,
    required: true,
  },
  second_major: {
    type: String,
    enum: SECOND_DEPARTMENT,
  },
  pass_semester: {
    type: String,
    enum: PASS_SEMESTER,
  },
  pass_description: String,
  application: [ApplicationSchema],
  wanna_sell:{
    type: Number,
    get: function (this: { wanna_sell: string }) {
      return this.wanna_sell === 'yes' ? 1 : 0;
    },
    set: function (this: { wanna_sell: string }, value: number) {
      this.wanna_sell = value === 1 ? 'yes' : 'no';
    },
  },
  caution: Number,
});
  
const CommentSchema = new Schema({
    _id: {
      type: ObjectId,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post_id: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: String,
    date: Number,
});


const User = mongoose.model('User', UserSchema);
const Major = mongoose.model('Major', MajorSchema);
const Post = mongoose.model('Post', PostSchema);
const Message = mongoose.model('Message', MessageSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const Application = mongoose.model('Application', ApplicationSchema);

export { User, Major, Post, Message, Comment, Application };
