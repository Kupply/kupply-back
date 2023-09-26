import { NextFunction, Request, Response } from 'express';
import * as pastDataService from '../service/pastDataService';
import { Types } from 'mongoose';

export const getPastData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = new Types.ObjectId('64cbc30b50187afa2c0fddce'); //임의로 설정하였고, 원래대로라면 request에서 받아야 함.

    const pastData = await pastDataService.getPastData(userId); //user Data를 찾아서 보낸다.
    res.send(pastData);
  } catch (err) {
    next(err);
  }
};

export const getPastDataByMajorAndSemester = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { majorName, semester } = req.params;

    const pastData = await pastDataService.getPastDataByMajorAndSemester(
      majorName,
      semester,
    );

    res.status(200).json({
      status: 'success',
      pastData,
    });
  } catch (err) {
    next(err);
  }
};
