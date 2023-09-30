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

export const reportUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;
    // FIXME: 알고 있는게 닉네임이 맞나?
    const { suspectNickname } = req.body;
    await userService.reportUser(userId, suspectNickname);

    res.status(200).json({
      status: 'success',
      message: '유저가 신고 완료되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};
