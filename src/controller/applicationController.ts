import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import * as applicationService from '../service/applicationService';

export const createApplicationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;
    const applyData = req.body; //POST 방식으로 정보를 받아 온다.

    const userApplicationData = await applicationService.createApplicationData(
      userId,
      applyData,
    );

    res.status(201).send({
      status: 'success',
      data: {
        userApplicationData,
      },
    });
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
    const userId = req.userId as Types.ObjectId;

    const userApplicationData = await applicationService.getApplicationData(
      userId,
    ); //user Data를 찾아서 보낸다.
    res.status(200).send({
      status: 'success',
      data: {
        userApplicationData,
      },
    });
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
    const userId = req.userId as Types.ObjectId;

    await applicationService.deleteApplicationData(userId);
    res.status(204).json({
      status: 'success',
      data: null,
    });
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
    const userId = req.userId as Types.ObjectId;
    const applyData = req.body; //POST 방식으로 정보를 받아 온다.

    const updatedApplicationData =
      await applicationService.updateApplicationData(userId, applyData);
    res.status(200).send({
      status: 'success',
      data: updatedApplicationData,
    });
  } catch (err) {
    next(err);
  }
};

export const hopeMajorsCurrentInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;

    const hopeMajorsCurrentInfo =
      await applicationService.hopeMajorsCurrentInfo(userId);

    res.status(200).send({
      status: 'success',
      data: hopeMajorsCurrentInfo,
    });
  } catch (err) {
    next(err);
  }
};
