import { Types } from 'mongoose';
import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import Application from '../models/applicationModel';
import Email from '../models/emailModel';
import * as jwt from '../utils/jwt';
import { sendAuthEmail, sendTempPassword } from '../utils/email';

type userDataType = {
  password: string;
  name: string;
  studentId: string;
  phoneNumber: string;
  email: string;
  firstMajor: string;
  nickname: string;
  role: string;
  refreshToken: string;
  secondMajor: string;
  passSemester: string;
  passDescription: string;
  passGPA: number;
  wannaSell: boolean;
  hopeMajor1: string;
  hopeMajor2: string;
  hopeSemester: string;
  curGPA: number;
};

export const join = async (userData: userDataType) => {
  // 인증된 email인지 확인
  const email = await Email.findOne({ email: userData.email });
  if (!email || !email.certificate) {
    throw { status: 401, message: '이메일 인증을 먼저 완료해주세요.' };
  }

  const firstMajor = await Major.findOne({
    name: userData.firstMajor,
  });

  if (!firstMajor) {
    throw {
      status: 404,
      message: '본전공에 존재하지 않는 전공이 입력되었습니다.',
    };
  }

  let newUser;
  let secondMajorId;

  if (userData.role === 'candidate') {
    // candidate
    const hopeMajor1 = await Major.findOne({ name: userData.hopeMajor1 });
    const hopeMajor2 = await Major.findOne({ name: userData.hopeMajor2 });

    if (!hopeMajor1 || !hopeMajor2) {
      throw {
        status: 404,
        message: '지원자 희망 이중전공에 존재하지 않는 전공이 입력되었습니다.',
      };
    }

    newUser = new User({
      password: userData.password,
      name: userData.name,
      studentId: userData.studentId,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      firstMajor: firstMajor._id,
      nickname: userData.nickname,
      role: userData.role,
      hopeMajor1: hopeMajor1,
      hopeMajor2: hopeMajor2,
      hopeSemester: userData.hopeSemester,
      curGPA: userData.curGPA,
      changeGPA: 0,
    });
  } else {
    // passer
    const secondMajor = await Major.findOne({
      name: userData.secondMajor,
    });

    if (!secondMajor) {
      throw {
        status: 404,
        message: '합격자 이중전공에 존재하지 않는 전공이 입력되었습니다.',
      };
    }

    secondMajorId = secondMajor._id;
    newUser = new User({
      password: userData.password,
      name: userData.name,
      studentId: userData.studentId,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      firstMajor: firstMajor._id,
      nickname: userData.nickname,
      role: userData.role,
      secondMajor: secondMajor._id,
      passSemester: userData.passSemester,
      passGPA: userData.passGPA,
    });
  }
  await newUser.save();

  // // 회원가입 완료 시 저장된 email을 certify 처리한다. -> 방식 수정
  // email.certificate = true;
  // await email.save();

  // 합격자면 그 정보 application에 바로 저장.
  if (userData.role === 'passer') {
    const passer = await User.findOne({ studentId: userData.studentId });

    await Application.create({
      candidateId: passer!._id,
      pnp: 'PASS',
      applyMajor1: secondMajorId,
      applySemester: userData.passSemester,
      applyGPA: userData.passGPA,
    });
  }

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
  if (!accessToken && !refreshToken) {
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
  const user = await User.findOne({ email: userEmail });
  const email = await Email.findOne({ email: userEmail });

  /*
  user에 있으면 이미 회원가입이 완료된 이메일이라고 알림
  certifyEmail에서 email.certificate true로 바꾸고 join에서 확인
  이메일 인증 완료하고 회원가입 단계에서 그만 두었을 때, user 모델에는 그 이메일이 없기에 다시 이메일 보내는 것에 문제 없음.
  */
  // 회원가입 완료된 이메일일 때
  if (user) {
    throw {
      status: 400,
      message: '이미 회원가입이 완료된 이메일 입니다. 로그인해주세요.',
    };
  }

  // 회원가입 완료 안된 이메일일 때
  const code = generateRandomString(111111, 999999);
  await sendAuthEmail(userEmail, code);

  if (email) {
    email.code = code;
    email.createdAt = new Date();
    email.certificate = false; // 굳이 필요한가?
    await email.save();
  } else {
    await Email.create({
      email: userEmail,
      code: code,
    });
  }
};

export const certifyEmail = async (userEmail: string, code: string) => {
  const email = await Email.findOne({ email: userEmail });

  if (!email) {
    throw { status: 400, message: '존재하지 않는 이메일 입니다.' };
  } else if (email.code !== code) {
    throw { status: 400, message: '인증번호가 일치하지 않습니다.' };
  } else if (email.createdAt.getTime() + 3 * 60 * 1000 < Date.now()) {
    throw {
      status: 400,
      message: '유효 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.',
    };
  }
  //인증 완료는 회원가입이 끝난 시점에 처리되어야 한다. -> 방식 수정
  email.certificate = true;
  await email.save();
  return;
};

export const nicknameCheck = async (Nickname: string) => {
  const nicknameFindResult = await User.find({ nickname: Nickname });

  if (nicknameFindResult.length > 0) return false;
  else return true;
};

const generateRandomPassword = () => {
  const allowedChars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*';

  let password = '';

  const passwordLength = 8 + Math.floor(Math.random() * 12);
  while (password.length < passwordLength) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars[randomIndex];
  }

  return password;
};

export const forgotPassword = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail }).select('+password');

  if (!user) {
    throw {
      status: 400,
      message:
        '존재하지 않는 이메일입니다. 회원가입을 통해 서비스에 가입해 주세요.',
    };
  }

  const oldPassword = user.password;
  const temporaryPassword = generateRandomPassword();

  try {
    user.password = temporaryPassword;
    await user.save();

    await sendTempPassword(userEmail, temporaryPassword);
  } catch (err) {
    // 중간에 오류났을 때 원래 비밀번호로 reset
    user.password = oldPassword;
    await user.save();
    throw { status: 500, message: '재시도해주세요.' };
  }

  return;
};
