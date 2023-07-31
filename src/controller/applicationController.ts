import { NextFunction, Request, Response } from 'express';
import * as applicationService from '../service/applicationService';
import { Types } from 'mongoose';

export const createApplicationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let applyData = req.body; //POST 방식으로 정보를 받아 온다.

    await applicationService.createApplicationData(applyData);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};

export const getApplicationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = new Types.ObjectId('64c76faea01a83ef15a9f141'); //임의로 설정하였고, 원래대로라면 request에서 받아야 함.

    const userData = await applicationService.getApplicationData(userId); //user Data를 찾아서 보낸다.
    res.send(userData);
  } catch (err) {
    next(err);
  }
};

export const deleteApplicationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = new Types.ObjectId('64c28df8f3ad2b9ac18163e1'); //임의로 설정하였고, 원래대로라면 request에서 받아야 함.

    const userData = await applicationService.deleteApplicationData(userId); //user Data를 찾아서 보낸다.
    res.send(userData);
  } catch (err) {
    next(err);
  }
};

export const updateApplicationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let applyData = req.body; //POST 방식으로 정보를 받아 온다.

    await applicationService.updateApplicationData(applyData);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
