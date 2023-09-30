import { Types } from 'mongoose';
import User from '../models/userModel';
import Report from '../models/reportModel';

export const getAllUsers = async () => {
  const users = await User.find()
    .populate('firstMajor', 'name')
    .populate('secondMajor', 'name');

  return users;
};

export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  return;
};

export const reportUser = async (
  userId: Types.ObjectId,
  suspectNickname: string,
) => {
  const suspect = await User.findOne({ nickname: suspectNickname });

  if (!suspect) {
    throw { status: 400, message: '존재하지 않는 유저입니다.' };
  }

  const report = await Report.findOne({
    reporter: userId,
    suspect: suspect._id,
  });

  if (
    report &&
    Date.now() < report.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000
  ) {
    throw {
      status: 400,
      message: '같은 유저는 한 달에 한 번만 신고할 수 있습니다.',
    };
  }

  if (report) {
    report.createdAt = new Date();
    await report.save();
  } else {
    await Report.create({
      reporter: userId,
      suspect: suspect._id,
    });
  }

  suspect.totalReport += 1;
  await suspect.save();

  return;
};
