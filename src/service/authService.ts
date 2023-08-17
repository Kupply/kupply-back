import { Types } from 'mongoose';
import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import * as jwt from '../utils/jwt';
import * as email from '../utils/email';

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

export const join = async (url: string, userData: userDataType) => {
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
  const certificateToken = jwt.createCertificateToken(newUser);
  await email.sendAuthEmail(url, newUser.name, newUser.email, certificateToken);
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
  } else if (user.certificate != 'active') {
    throw {
      status: 401,
      message: '이메일을 인증하여 회원가입을 완료하시고 다시 로그인해 주세요.',
    };
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

export const certifyUser = async (certificateToken: string) => {
  const { id } = jwt.decodeToken(certificateToken);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { certificate: 'active' },
    {
      new: true,
    },
  );

  if (!updatedUser)
    throw {
      status: 404,
      message: '존재하지 않는 유저입니다. 회원가입 후 재시도해주세요.',
    };
};
