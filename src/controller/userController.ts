import { NextFunction, Request, Response } from 'express';
import * as userService from '../service/userService';
export const joinUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userService.joinUser();
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};
