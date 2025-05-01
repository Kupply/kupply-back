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

export const deleteMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;
    await userService.deleteMe(userId);

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
    const { newPassword } = req.body;

    await userService.resetPassword(userId, newPassword);

    res.status(200).json({
      status: 'success',
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};

export const getProfileFromS3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;

    const imageUrl = await userService.getProfileFromS3(userId);

    res.status(201).json({
      status: 'success',
      imageUrl,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadProfileToS3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw { status: 400, message: 'File not found' };
    }

    const userId = req.userId as Types.ObjectId;
    const fileData: Express.Multer.File = req.file;

    const imageUrl = await userService.uploadProfileToS3(userId, fileData);

    res.status(201).json({
      status: 'success',
      imageUrl,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadResumeToS3 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw { status: 400, message: 'File not found' };
    }

    const userId = req.userId as Types.ObjectId;
    const fileData: Express.Multer.File = req.file;

    await userService.uploadResumeToS3(userId, fileData);

    res.status(201).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};
