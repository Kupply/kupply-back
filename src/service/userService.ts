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
