import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import * as userService from '../service/userService';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
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
    const userId = req.params.id;
    await userService.deleteUser(userId);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;
    const user = await userService.getMe(userId);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;

    const updatedUser = await userService.updateMe(userId, req.body);

    res.status(201).json({
      status: 'success',
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;
    const { oldPassword, newPassword } = req.body;

    await userService.resetPassword(userId, oldPassword, newPassword);

    res.status(200).json({
      status: 'success',
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};
