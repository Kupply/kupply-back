import { NextFunction, Request, Response } from 'express';
import * as adminService from '../service/adminService';

export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      passCount,
      failCount,
      diffCount,
      totalCount,
      passButNotAppliedCount,
      firstHopePasserCount,
      secondHopePasserCount,
    } = await adminService.updateApplication();

    res.status(200).json({
      status: 'success',
      data: {
        message: `지원 정보 갱신이 성공적으로 완료되었습니다.`,
        passCount,
        failCount,
        diffCount,
        totalCount,
        passButNotAppliedCount,
        firstHopePasserCount,
        secondHopePasserCount,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateMajors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await adminService.updateMajors();

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
