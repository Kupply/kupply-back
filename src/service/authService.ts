import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';

interface JwtPayload {
  id: string;
}

const createToken = (user: IUser) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '1h',
  });

  return accessToken;
};

const createRefreshToken = () => {
  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET_KEY!, {
    expiresIn: '30d',
  });

  return refreshToken;
};

const verifyToken = (accessToken: string) => {
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY!,
    ) as JwtPayload;

    return id;
  } catch (err) {
    return null;
  }
};

const verifyRefreshToken = (refreshToken: string) => {
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY!);
    return true;
  } catch (err) {
    return false;
  }
};

export const join = async (userInfo: IUser) => {
  const firstMajorName = userInfo.firstMajor;
  const firstMajor: IMajor | null = await Major.findOne({
    name: firstMajorName,
  }).exec();
  const secondMajorName = userInfo.secondMajor;

  if (!secondMajorName) {
    // candidate
    const newUser = await User.create({
      password: userInfo.password,
      studentId: userInfo.studentId,
      email: userInfo.email,
      firstMajor: firstMajor!._id,
      name: userInfo.name,
      nickname: userInfo.nickname,
      role: userInfo.role,
      hopeMajors: userInfo.hopeMajors,
    });
    return newUser;
  } else {
    // passer
    const secondMajor: IMajor | null = await Major.findOne({
      name: secondMajorName,
    }).exec();
    const newUser = await User.create({
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
    return newUser;
  }
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

  const accessToken = createToken(user);
  const refreshToken = createRefreshToken();

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
    const { id } = jwt.decode(accessToken) as JwtPayload;
    await User.findByIdAndUpdate(id, { refreshToken: null });
  }
};

export const protect = async (accessToken: string, refreshToken: string) => {
  // 1) 토큰이 있는지 확인, 없으면 로그인하도록.
  if (!accessToken || !refreshToken) {
    throw { status: 401, message: '로그인 후 재시도해주세요.' };
  }

  let newAccessToken: string = '';

  // 2) accessToken이 유효한지 확인
  const accessResult = verifyToken(accessToken);

  if (accessResult === null) {
    // 2 - 2) accessToken 만료되었음
    // 3) user model에서 refreshToken 가져오고 유효한지 확인
    const { id } = jwt.decode(accessToken) as JwtPayload;
    const user = await User.findById(id);

    if (!user || !user.refreshToken)
      throw {
        status: 400,
        message: 'Invalid refresh token - id error',
      };

    if (verifyRefreshToken(user.refreshToken)) {
      // 3 - 1) refreshToken 유효하다면 accessToken 새로 발급하고 user와 accessToken 리턴
      newAccessToken = createToken(user);

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
