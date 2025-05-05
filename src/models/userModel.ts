import { Schema, Model, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  // 공통
  _id: Types.ObjectId;
  koreapasUUID: string;
  password: string; // FIXME: To Be Deleted
  name: string;
  studentId: string;
  email: string;
  firstMajor: Types.ObjectId;
  nickname: string;
  role: string;
  refreshToken: string;
  totalReport: number;
  profilePic: string;
  profileName: string; // s3에 저장된 이름
  leave: boolean; // 탈퇴한 유저이면 true
  campus: string; // 소속캠퍼스 (서울캠: A , 세종캠: S , 대학원생: G, 교류학생: C)
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
  curGPA: number;
  changeGPA: number;
  isApplied: boolean;
}

const userSchema = new Schema<IUser>(
  {
    // common info of user
    koreapasUUID: {
      type: String,
      required: [true, 'User must have a koreapas UUID.'],
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 20,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'User must have a name.'],
    },
    studentId: {
      type: String,
      required: [true, 'User must have a student ID.'],
    },
    email: {
      type: String,
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
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ['passer', 'candidate', 'admin'],
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
    profilePic: {
      type: String,
      enum: {
        values: [
          'rectProfile1',
          'rectProfile2',
          'rectProfile3',
          'rectProfile4',
          'customProfile',
        ],
      },
      default: 'rectProfile1',
    },
    profileName: {
      type: String,
    },
    leave: {
      type: Boolean,
      default: false,
    },
    campus: {
      type: String,
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
    curGPA: {
      type: Number,
      min: 0,
      max: 4.5,
    },
    changeGPA: {
      type: Number,
      max: 2,
    },
    isApplied: {
      type: Boolean,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
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
