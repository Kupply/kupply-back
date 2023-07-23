const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  _id: ObjectId,
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  first_major: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },   //원래 Schema의 User table 정보
  is_passed: {
    type: Boolean,
    required: true,
  },  //합격 여부를 받고, 합격 하였다면 passer_info를 따로 두는 대신 지원 정보를 넣는다.
  applied_data: [{
    type: ObjectId,
    ref: "Applied_data",
  },],
  hope_majors: [{
    type: ObjectId,
    ref: "Major",
  },],
});

export default mongoose.model('User', UserSchema);
