import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import Major from '../models/majorModel';
import bcrypt from 'bcryptjs';

export const join = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await User.create(req.body);
    return newUser;
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // FIXME: 1) T, F말고 user 보내주고 싶은데, 그러면 return false 대신 에러 생성해야 하는데 에러 생성이 안 돼서 일단 T, F
    // 2) userModel에 checkPassword 함수를 만들었는데 user.checkPassword가 안 돼서 여기서 compare
    // 3) user.password도 에러떠서 ! 붙였는데 이렇게 해도 되나
    const { email, password } = req.body;

    if (!email || !password) return false;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password!)))
      return false;

    return true;
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find()
      .populate('firstMajor', 'name')
      .populate('secondMajor', 'name');
    return users;
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    return user;
  } catch (err) {
    next(err);
  }
};
