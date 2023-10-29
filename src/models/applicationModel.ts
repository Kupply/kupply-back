import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Application must have a candidate'],
  },
  pnp: {
    type: String,
    enum: ['PASS', 'FAIL', 'TBD'],
    default: 'TBD',
  },
  applyMajor1: {
    type: Schema.Types.ObjectId,
    ref: 'Major',
    required: true,
  },
  applyMajor2: {
    type: Schema.Types.ObjectId,
    ref: 'Major',
  },
  applySemester: {
    type: String,
    required: true,
    maxLength: 6,
    minLength: 6,
    // ex) 2023-1
  },
  applyTimes: {
    type: String,
    enum: ['First', 'Reapply'],
    default: 'First',
  },
  applyGPA: {
    type: Number,
    required: true,
    min: 0,
    max: 4.5,
  },
  applyDescription: {
    type: String,
  },
  applyGrade: {
    type: String,
    required: true,
    maxLength: 3,
    minLength: 3,
  },
  // ex) 3-2 (3학년 2학기)
});

export default mongoose.model('Application', applicationSchema);
