import { NextFunction, Request, Response } from 'express';
import * as adminService from '../service/adminService';

export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { passCount, failCount, totalCount, passButNotAppliedCount } =
      await adminService.updateApplication();

    res.status(200).json({
      status: 'success',
      data: {
        message: `지원 정보 갱신이 성공적으로 완료되었습니다.`,
        passCount,
        failCount,
        totalCount,
        passButNotAppliedCount,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateTO = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await adminService.updateTO();

    res.status(200).json({
      status: 'success',
      data: {
        message: `TO 정보 갱신이 성공적으로 완료되었습니다.`,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
