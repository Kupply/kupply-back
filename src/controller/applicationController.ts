import { NextFunction, Request, Response } from 'express';
import * as applicationService from '../service/applicationService';

export const createApplicationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let applyData = req.body;
    applyData.userId = 2019320051; //ObjectId를 받지 않는 경우를 상정해서 임의 fake user studentId 추가하기

    await applicationService.createApplicationData(applyData);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
