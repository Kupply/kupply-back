import { NextFunction, Request, Response } from 'express';
import * as userService from '../service/entityService';

export const joinUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.body;

    const newUser = await userService.createUser(userData);
    
    const majorData = {
      applied_major1: req.body.applied_major1,
      applied_major2: req.body.applied_major2,
    };
    const newMajor = await userService.createMajor(majorData);
    
    res.status(200).json({ user: newUser, major: newMajor });
  } catch (err) {
    console.error('사용자 가입 중 오류 발생:', err);
    next(err);
  }
};
