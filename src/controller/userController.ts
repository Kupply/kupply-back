import { NextFunction, Request, Response } from 'express';
import * as userService from '../service/userService';

export const join = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userService.join(req, res, next);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
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
    if (!(await userService.login(req, res, next))) {
      throw { status: 401, message: 'Check your email or password' };
    }

    res.status(200).json({
      status: 'success',
    });
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
    const users = await userService.getAllUsers(req, res, next);
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
    const user = await userService.deleteUser(req, res, next);

    if (!user) {
      throw { status: 404, message: 'User not found with this id' };
    }
  } catch (err) {}
};
