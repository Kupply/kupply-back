import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import * as jwt from '../utils/jwt';
import * as email from '../utils/email';

export const join = async (userInfo: IUser) => {
  const firstMajorName = userInfo.firstMajor;
  const firstMajor: IMajor | null = await Major.findOne({
    name: firstMajorName,
  }).exec();
  const secondMajorName = userInfo.secondMajor;
  let newUser: IUser;

  if (!secondMajorName) {
    // candidate
    newUser = await User.create({
      password: userInfo.password,
      studentId: userInfo.studentId,
      email: userInfo.email,
      firstMajor: firstMajor!._id,
      name: userInfo.name,
      nickname: userInfo.nickname,
      role: userInfo.role,
      hopeMajors: userInfo.hopeMajors,
    });
  } else {
    // passer
    const secondMajor: IMajor | null = await Major.findOne({
      name: secondMajorName,
    }).exec();

    newUser = await User.create({
      password: userInfo.password,
      studentId: userInfo.studentId,
      email: userInfo.email,
      firstMajor: firstMajor!._id,
      name: userInfo.name,
      nickname: userInfo.nickname,
      role: userInfo.role,
      secondMajor: secondMajor!._id,
      passSemester: userInfo.passSemester,
      passDescription: userInfo.passDescription,
      passGPA: userInfo.passGPA,
      wannaSell: userInfo.wannaSell,
    });
  }
  const certificateToken = jwt.createCertificateToken(newUser);
  await email.sendAuthEmail(newUser.name, newUser.email, certificateToken);
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
    const userId = jwt.decodeToken(accessToken);
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }
};

export const protect = async (accessToken: string, refreshToken: string) => {
  // 1) 토큰이 있는지 확인, 없으면 로그인하도록.
  if (!accessToken || !refreshToken) {
    throw { status: 401, message: '로그인 후 재시도해주세요.' };
  }

  let newAccessToken: string = '';

  // 2) accessToken이 유효한지 확인
  const accessResult = jwt.verifyToken(accessToken);

  if (accessResult === null) {
    // 2 - 2) accessToken 만료되었음
    // 3) user model에서 refreshToken 가져오고 유효한지 확인
    const userId = jwt.decodeToken(accessToken);
    const user = await User.findById(userId);

    if (!user || !user.refreshToken)
      throw {
        status: 400,
        message: 'Invalid refresh token - id error',
      };

    if (jwt.verifyRefreshToken(user.refreshToken)) {
      // 3 - 1) refreshToken 유효하다면 accessToken 새로 발급하고 user와 accessToken 리턴
      newAccessToken = jwt.createToken(user);

      return { user, newAccessToken };
    } else {
      // 3 - 2) refreshToken도 만료되었다면 새로 로그인하도록 throw error.
      throw {
        status: 400,
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
      };
    }
  } else {
    // 2 - 1) accessToken이 유효하다면 유저 리턴
    const user = await User.findById(accessResult);

    // 실행되는 일 없을 것임, ts에러 떠서 추가.

    if (!user) throw { status: 400, message: 'Bad Request' };

    return { user, newAccessToken };
  }
};

export const certifyUser = async (certificateToken: string) => {
  const userId = jwt.decodeToken(certificateToken);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
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
