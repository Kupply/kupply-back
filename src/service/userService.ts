import { Types } from 'mongoose';
import User from '../models/userModel';
import Major, { IMajor } from '../models/majorModel';
import Application from '../models/applicationModel';
import Email from '../models/emailModel';
import * as s3 from '../utils/s3';

export type updateDataType = {
  newName: string;
  newStudentId: string;
  newFirstMajor: string;
  newProfilePic: string;
  newNickname: string;
  newHopeMajor1: string;
  newHopeMajor2: string;
  newCurGPA: number;
  newHopeSemester: string;
};

export const getAllUsers = async () => {
  const users = await User.find()
    .populate('firstMajor', 'name')
    .populate('secondMajor', 'name');

  return users;
};

export const deleteMe = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (user) {
    if (user.role === 'passer') {
      // 합격자일 때 - 신상, 이메일 완전 삭제 / 지원정보는 유지
      await Email.findOneAndDelete({ email: user.email });
      await User.findByIdAndDelete(userId);
    } else {
      // 지원자일 때 - 이메일 완전 삭제/ 신상과 지원정보는 유지
      const deleteMajor1 = await Major.findById(user.hopeMajor1);
      const deleteMajor2 = await Major.findById(user.hopeMajor2);

      if (deleteMajor1 && deleteMajor1.interest !== undefined) {
        (deleteMajor1.interest as number)--;
        await deleteMajor1.save();
      }
      if (deleteMajor2 && deleteMajor2.interest !== undefined) {
        (deleteMajor2.interest as number)--;
        await deleteMajor2.save();
      }
      await Email.findOneAndDelete({ email: user.email });
      user.leave = true;
      await user.save();
    }
  }

  return;
};

export const getMe = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { status: 404, message: '존재하지 않는 사용자입니다.' };
  }

  let profileLink: string = '';
  if (user.profilePic === 'customProfile' && user.profileName) {
    profileLink = await s3.getFileFromS3({ Key: user.profileName });
  }

  if (user.role === 'candidate') {
    const firstMajorName = ((await Major.findById(user.firstMajor)) as IMajor)
      .name;
    const hopeMajorName1 = ((await Major.findById(user.hopeMajor1)) as IMajor)
      .name;
    const hopeMajorName2 = ((await Major.findById(user.hopeMajor2)) as IMajor)
      .name;

    return {
      name: user.name,
      nickname: user.nickname,
      profilePic: user.profilePic,
      profileLink: profileLink,
      role: user.role,
      firstMajor: firstMajorName,
      studentId: user.studentId,
      email: user.email,
      curGPA: user.curGPA,
      hopeSemester: user.hopeSemester,
      hopeMajor1: hopeMajorName1,
      hopeMajor2: hopeMajorName2,
      isApplied: user.isApplied,
    };
  } else {
    // 합격자 자기정보 필요한 경우 있나..?
    const firstMajorName = ((await Major.findById(user.firstMajor)) as IMajor)
      .name;
    const secondMajorName = ((await Major.findById(user.secondMajor)) as IMajor)
      .name;

    return {
      name: user.name,
      nickname: user.nickname,
      profilePic: user.profilePic,
      profileLink: profileLink,
      role: user.role,
      firstMajor: firstMajorName,
      studentId: user.studentId,
      email: user.email,
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

  const deleteMajor1 = user.hopeMajor1;
  const deleteMajor2 = user.hopeMajor2;

  if (updateData.newName) {
    user.name = updateData.newName;
  }

  if (updateData.newStudentId && updateData.newStudentId !== user.studentId) {
    const tmpUser = await User.findOne({ studentId: updateData.newStudentId });
    if (tmpUser) {
      throw { status: 400, message: '이미 사용중인 학번입니다.' };
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

  if (updateData.newProfilePic) {
    // 전에 올린 customProfile에서 default1~4로 바꾸는 경우에
    // 전에 올린 것 s3에서 제거
    if (user.profileName) {
      await s3.deleteFileFromS3({ Key: user.profileName });
    }

    if (updateData.newProfilePic !== 'customProfile') {
      user.profileName = '';
    }
    user.profilePic = updateData.newProfilePic;
  }

  if (updateData.newNickname && updateData.newNickname !== user.nickname) {
    const tmpUser = await User.findOne({ nickname: updateData.newNickname });
    if (tmpUser) {
      throw { status: 400, message: '이미 사용중인 닉네임입니다.' };
    } else {
      user.nickname = updateData.newNickname;
    }
  }

  if (updateData.newHopeMajor1 && user.role === 'candidate') {
    const major = await Major.findOne({ name: updateData.newHopeMajor1 });

    if (!major) {
      throw { status: 404, message: '존재하지 않는 전공명입니다.' };
    } else {
      user.hopeMajor1 = major._id;
    }
  }

  if (updateData.newHopeMajor2 && user.role === 'candidate') {
    const major = await Major.findOne({ name: updateData.newHopeMajor2 });

    if (!major) {
      throw { status: 404, message: '존재하지 않는 전공명입니다.' };
    } else {
      user.hopeMajor2 = major._id;
    }
  }

  if (updateData.newCurGPA && user.role === 'candidate') {
    // FIXME: 이중전공 지원기간 아니면 if문 주석처리, 지원기간 끝나면 모든 candidate 유저의 changeGPA 0으로 reset.
    // => 더 좋은 방법이 있을 것 같은데...
    if (user.changeGPA >= 2) {
      throw {
        status: 400,
        message:
          '이중전공 지원 기간에는 학점을 최대 두 번까지만 변경 가능합니다.',
      };
    }
    user.changeGPA++;
    user.curGPA = updateData.newCurGPA;
  }

  if (updateData.newHopeSemester && user.role === 'candidate') {
    user.hopeSemester = updateData.newHopeSemester;
  }

  const updatedUser = await user.save();

  if (updateData.newHopeMajor1 && updatedUser.role === 'candidate') {
    const major = await Major.findOne({ name: updateData.newHopeMajor1 });

    if (major && major.interest !== undefined) {
      (major.interest as number)++;
      console.log(major.name);
      await major.save();
    }

    const deleteMajor = await Major.findById(deleteMajor1);

    if (deleteMajor && deleteMajor.interest !== undefined) {
      (deleteMajor.interest as number)--;
      console.log(deleteMajor.name);
      await deleteMajor.save();
    }
  }

  if (updateData.newHopeMajor2 && updatedUser.role === 'candidate') {
    const major = await Major.findOne({ name: updateData.newHopeMajor2 });

    if (major && major.interest !== undefined) {
      (major.interest as number)++;
      console.log(major.name);
      await major.save();
    }

    const deleteMajor = await Major.findById(deleteMajor2);

    if (deleteMajor && deleteMajor.interest !== undefined) {
      (deleteMajor.interest as number)--;
      console.log(deleteMajor.name);
      await deleteMajor.save();
    }
  }
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
    throw { status: 400, message: '비밀번호가 일치하지 않습니다.' };
  }

  user.password = newPassword;
  await user.save();

  return;
};

export const getProfileFromS3 = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { stats: 404, message: '존재하지 않는 사용자입니다.' };
  }

  if (!user.profileName) {
    throw {
      stats: 404,
      message: '이 사용자는 프로필 이미지가 존재하지 않습니다.',
    };
  }

  const imageUrl = await s3.getFileFromS3({ Key: user.profileName });

  return imageUrl;
};

export const uploadProfileToS3 = async (
  userId: Types.ObjectId,
  fileData: Express.Multer.File,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { stats: 404, message: '존재하지 않는 사용자입니다.' };
  }

  // s3에 저장할 이미지 이름 설정
  const profileName = `userProfiles/${Date.now()}_${fileData.originalname}`;
  const uploadObjectParams = {
    Key: profileName,
    Body: fileData.buffer,
    ContentType: fileData.mimetype,
  };

  await s3.uploadFileToS3(uploadObjectParams);

  // 기존에 업로드 된 것이 있으면 s3에서 삭제
  if (user.profileName) {
    await s3.deleteFileFromS3({ Key: user.profileName });
  }
  user.profilePic = 'customProfile';
  user.profileName = profileName;
  await user.save();

  const imageUrl = await s3.getFileFromS3({ Key: profileName });

  return imageUrl;
};

export const uploadResumeToS3 = async (
  userId: Types.ObjectId,
  fileData: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { status: 404, message: '존재하지 않는 사용자입니다.' };
  }

  const hopeMajor1 = (await Major.findById(user.hopeMajor1)) as IMajor;

  const resumeName = `userResume/${hopeMajor1.name}/${Date.now()}_${
    fileData.originalname
  }`;

  const uploadObjectParams = {
    Key: resumeName,
    Body: fileData.buffer,
    ContentType: fileData.mimetype,
  };

  await s3.uploadFileToS3(uploadObjectParams);

  return;
};
