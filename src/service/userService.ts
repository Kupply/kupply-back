import { Types } from 'mongoose';
import User from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';

export type updateDataType = {
  newNickname: string;
  newStudentId: number;
  newFirstMajor: string;
  newHopeMajor1: string;
  newHopeMajor2: string;
  newHopeSemester: string;
  newCurGPA: number;
};

export const getAllUsers = async () => {
  const users = await User.find()
    .populate('firstMajor', 'name')
    .populate('secondMajor', 'name');

  return users;
};

export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw { status: 404, message: '존재하지 않는 사용자입니다.' };
  }

  return;
};

export const getMe = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { status: 404, message: '존재하지 않는 사용자입니다.' };
  }

  if (user.role === 'candidate') {
    const firstMajorName = ((await Major.findById(user.firstMajor)) as IMajor)
      .name;
    const hopeMajorName1 = ((await Major.findById(user.hopeMajor1)) as IMajor)
      .name;
    const hopeMajorName2 = ((await Major.findById(user.hopeMajor2)) as IMajor)
      .name;

    return {
      studentId: user.studentId,
      email: user.email,
      firstMajor: firstMajorName,
      nickname: user.nickname,
      role: user.role,
      curGPA: user.curGPA,
      hopeSemester: user.hopeSemester,
      hopeMajor1: hopeMajorName1,
      hopeMajor2: hopeMajorName2,
    };
  } else {
    // 합격자 자기정보 필요한 경우 있나..?
    const firstMajorName = ((await Major.findById(user.firstMajor)) as IMajor)
      .name;
    const secondMajorName = ((await Major.findById(user.secondMajor)) as IMajor)
      .name;

    return {
      studentId: user.studentId,
      email: user.email,
      firstMajor: firstMajorName,
      nickname: user.nickname,
      role: user.role,
      secondMajor: secondMajorName,
      passSemester: user.passSemester,
      passGPA: user.passGPA,
    };
  }
};

export const updateMe = async (
  userId: Types.ObjectId,
  updateData: updateDataType,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { status: 404, message: '존재하지 않는 사용자입니다.' };
  }

  if (updateData.newNickname) {
    const tmpUser = await User.findOne({ nickname: updateData.newNickname });
    if (tmpUser) {
      throw { status: 401, message: '이미 사용중인 닉네임입니다.' };
    } else {
      user.nickname = updateData.newNickname;
    }
  }
  if (updateData.newStudentId) {
    const tmpUser = await User.findOne({ studentId: updateData.newStudentId });
    if (tmpUser) {
      throw { status: 401, message: '이미 사용중인 학번입니다.' };
    } else {
      user.studentId = updateData.newStudentId;
    }
  }
  if (updateData.newFirstMajor) {
    const major = await Major.findOne({ name: updateData.newFirstMajor });

    if (!major) {
      throw { status: 404, message: '존재하지 않는 전공명입니다.' };
    } else {
      user.firstMajor = major._id;
    }
  }
  if (updateData.newHopeMajor1) {
    const major = await Major.findOne({ name: updateData.newHopeMajor1 });

    if (!major) {
      throw { status: 404, message: '존재하지 않는 전공명입니다.' };
    } else {
      user.hopeMajor1 = major._id;
    }
  }
  if (updateData.newHopeMajor2) {
    const major = await Major.findOne({ name: updateData.newHopeMajor2 });

    if (!major) {
      throw { status: 404, message: '존재하지 않는 전공명입니다.' };
    } else {
      user.hopeMajor2 = major._id;
    }
  }
  if (updateData.newCurGPA) {
  }

  const updatedUser = await user.save();

  return updatedUser;
};

export const resetPassword = async (
  userId: Types.ObjectId,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw {
      status: 400,
      message:
        '로그인한 유저만 비밀번호를 변경할 수 있으므로, 실행되는 일 없을 것임',
    };
  } else if (!(await user.checkPassword(oldPassword))) {
    throw { status: 401, message: '비밀번호가 일치하지 않습니다.' };
  }

  user.password = newPassword;
  await user.save();

  return;
};
