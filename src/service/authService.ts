import { Types } from 'mongoose';
import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import Email from '../models/emailModel';
import * as jwt from '../utils/jwt';
import { sendAuthEmail } from '../utils/email';

type userDataType = {
  password: string;
  studentId: number;
  email: string;
  firstMajor: string;
  name: string;
  nickname: string;
  role: string;
  refreshToken: string;
  certificate: string;
  secondMajor: string;
  passSemester: string;
  passDescription: string;
  passGPA: number;
  wannaSell: boolean;
  hopeMajors: Array<string> | null;
};

export const join = async (userData: userDataType) => {
  // TODO: 인증된 email인지 확인?
  const firstMajorName = userData.firstMajor;
  const secondMajorName = userData.secondMajor;
  const firstMajor = (await Major.findOne({
    name: firstMajorName,
  })) as IMajor;

  let newUser;

  if (!secondMajorName) {
    // candidate
    newUser = new User({
      password: userData.password,
      studentId: userData.studentId,
      email: userData.email,
      firstMajor: firstMajor._id,
      name: userData.name,
      nickname: userData.nickname,
      role: userData.role,
      hopeMajors: userData.hopeMajors,
    });
  } else {
    // passer
    const secondMajor = (await Major.findOne({
      name: secondMajorName,
    })) as IMajor;

    newUser = new User({
      password: userData.password,
      studentId: userData.studentId,
      email: userData.email,
      firstMajor: firstMajor._id,
      name: userData.name,
      nickname: userData.nickname,
      role: userData.role,
      secondMajor: secondMajor._id,
      passSemester: userData.passSemester,
      passDescription: userData.passDescription,
      passGPA: userData.passGPA,
      wannaSell: userData.wannaSell,
    });
  }

  await newUser.save();
  return newUser;
};

export const login = async (userData: IUser) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw { status: 400, message: '이메일 또는 비밀번호를 입력해주세요.' };
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw { status: 401, message: '존재하지 않는 이메일입니다.' };
  } else if (!(await user.checkPassword(password))) {
    throw { status: 401, message: '비밀번호가 일치하지 않습니다.' };
  }

  const accessToken = jwt.createToken(user);
  const refreshToken = jwt.createRefreshToken();

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    {
      new: true,
    },
  );

  return { updatedUser, accessToken, refreshToken };
};

export const logout = async (accessToken: string) => {
  if (accessToken) {
    const { id } = jwt.decodeToken(accessToken);
    await User.findByIdAndUpdate(id, { refreshToken: null });
  }
};

export const protect = async (accessToken: string, refreshToken: string) => {
  // 1) 토큰이 있는지 확인, 없으면 로그인하도록.
  if (!accessToken || !refreshToken) {
    throw { status: 401, message: '로그인 후 재시도해주세요.' };
  }

  let newAccessToken: string = '';
  let userId: Types.ObjectId;
  let userRole: string;

  // 2) accessToken이 유효한지 확인
  const accessResult = jwt.verifyToken(accessToken);

  if (accessResult === null) {
    // 2 - 2) accessToken 만료되었음
    // 3) user model에서 refreshToken 가져오고 유효한지 확인
    const { id } = jwt.decodeToken(accessToken);
    const user = await User.findById(id);

    if (!user || !user.refreshToken)
      throw {
        status: 400,
        message: 'Invalid refresh token - id error',
      };

    if (jwt.verifyRefreshToken(user.refreshToken)) {
      // 3 - 1) refreshToken 유효하다면 accessToken 새로 발급하고 user와 accessToken 리턴
      newAccessToken = jwt.createToken(user);
      userId = user.id;
      userRole = user.role;
    } else {
      // 3 - 2) refreshToken도 만료되었다면 새로 로그인하도록 throw error.
      throw {
        status: 400,
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
      };
    }
  } else {
    userId = accessResult.id;
    userRole = accessResult.role;
  }

  return { userId, userRole, newAccessToken };
};

const generateRandomString = (min: number, max: number): string => {
  let randNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randNum.toString();
};

export const sendEmail = async (userEmail: string) => {
  const email = await Email.findOne({ email: userEmail });

  // 인증 완료된 이메일일 때
  if (email && email.certificate == true) {
    throw {
      status: 400,
      message: '이미 회원가입이 완료된 이메일 입니다. 로그인해주세요.',
    };
  }

  // 없거나, 인증이 완료되지 않은 이메일일 때
  const code = generateRandomString(111111, 999999);
  await sendAuthEmail(userEmail, code);

  if (email) {
    email.code = code;
    email.createdAt = new Date();
    await email.save();
  } else {
    await Email.create({
      email: userEmail,
      code: code,
    });
  }
};

export const certifyEmail = async (userEmail: string, code: string) => {
  const email = await Email.findOne({ email: userEmail, code: code });

  if (!email) {
    console.log(1);
    throw { status: 400, message: '인증번호가 일치하지 않습니다.' };
  }
  if (email.createdAt.getTime() + 3 * 60 * 1000 < Date.now()) {
    console.log(2);
    throw {
      status: 400,
      message: '유효 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.',
    };
  }
  email.certificate = true;
  await email.save();
  return;
};

export const nicknameCheck = async (Nickname: String) => {
  const nicknameFindResult = await User.find({nickname: Nickname});

  console.log(nicknameFindResult);
  if(nicknameFindResult.length > 0)
    return false;
  else
    return true;
};
