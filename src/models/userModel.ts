import { Schema, Model, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId;
  password: string;
  studentId: number;
  email: string;
  firstMajor: Types.ObjectId;
  name: string;
  nickname: string;
  role: string;
  refreshToken: string;
  secondMajor: Types.ObjectId;
  passSemester: string;
  passDescription: string;
  passGPA: number;
  wannaSell: boolean;
  hopeMajors: Array<string> | null;
  checkPassword: (userPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    // common info of user
    password: {
      type: String,
      required: [true, 'User must have a password.'],
      minLength: 10,
      select: false,
    },
    studentId: {
      type: Number,
      required: [true, 'User must have a student ID.'],
      unique: true,
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
    name: {
      type: String,
      required: [true, 'User must have a name.'],
      trim: true,
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
    hopeMajors: {
      type: [String],
      validate: [arrayLimit, 'You can only have 2 hopes'],
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
