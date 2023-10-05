import { Schema, Model, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  // 공통
  _id: Types.ObjectId;
  password: string;
  name: string;
  studentId: number;
  phoneNumber: string;
  email: string;
  firstMajor: Types.ObjectId;
  nickname: string;
  role: string;
  refreshToken: string;
  totalReport: number;
  checkPassword: (userPassword: string) => Promise<boolean>;
  // 합격자만
  secondMajor: Types.ObjectId;
  passSemester: string;
  passDescription: string;
  passGPA: number;
  wannaSell: boolean;
  // 지원자만
  hopeMajor1: Types.ObjectId;
  hopeMajor2: Types.ObjectId;
  hopeSemester: string;
  curGPA: number;
}

const userSchema = new Schema<IUser>(
  {
    // common info of user
    password: {
      type: String,
      required: [true, 'User must have a password.'],
      minLength: 8,
      maxLength: 20,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'User must have a name.'],
    },
    studentId: {
      type: Number,
      required: [true, 'User must have a student ID.'],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'User must have a phone number.'],
      unique: true,
      match: [/^010-\d{4}-\d{4}$/, 'Please fill a valid phone number'],
    },
    email: {
      type: String,
      required: [true, 'User must have an email address.'],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@korea\.ac\.kr$/,
        'Please fill a valid korea university email address',
      ],
    },
    firstMajor: {
      type: Schema.Types.ObjectId,
      ref: 'Major',
      required: true,
    },
    nickname: {
      type: String,
      required: [true, 'User must have a nickname.'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ['passer', 'candidate'],
        message: 'User role must be either: passer or candidate.',
      },
      required: [true, 'User must have a role.'],
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    totalReport: {
      type: Number,
      default: 0,
    },
    // info of passer only
    secondMajor: {
      type: Schema.Types.ObjectId,
      ref: 'Major',
    },
    passSemester: {
      type: String,
      maxLength: 6,
      minLength: 6,
      // ex) 2023-1
    },
    passDescription: {
      type: String,
    },
    passGPA: {
      type: Number,
      min: 0,
      max: 4.5,
    },
    wannaSell: {
      type: Boolean,
    },
    // info of candidate only
    hopeMajor1: {
      type: Schema.Types.ObjectId,
      ref: 'Major',
    },
    hopeMajor2: {
      type: Schema.Types.ObjectId,
      ref: 'Major',
    },
    hopeSemester: {
      type: String,
      maxLength: 6,
      minLength: 6,
      // ex) 2023-1
    },
    curGPA: {
      type: Number,
      min: 0,
      max: 4.5,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

// Not stored in DB
userSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'candidateId',
});
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId',
});
userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'author',
});
userSchema.virtual('sendMessages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'sender',
});
userSchema.virtual('receiveMessages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'receiver',
});

function arrayLimit(val: string[]) {
  return val.length <= 2;
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

userSchema.methods.checkPassword = async function (userPassword: string) {
  return await bcrypt.compare(userPassword, this.password);
};

export default model<IUser>('User', userSchema);
