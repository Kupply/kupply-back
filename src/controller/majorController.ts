import { NextFunction, Request, Response } from 'express';
import * as majorService from '../service/majorService';

export const getAllMajors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const majors = await majorService.getAllMajors();
    res.status(200).json({
      status: 'success',
      data: {
        majors,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createMajor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const majorData = req.body;
    const newMajor = await majorService.createMajor(majorData);

    res.status(201).json({
      status: 'success',
      data: {
        major: newMajor,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMajor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const majorId = req.params.id;
    const major = await majorService.getMajor(majorId);
    res.status(200).json({
      status: 'success',
      data: {
        major,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateMajor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const majorId = req.params.id;
    const majorData = req.body;
    const major = await majorService.updateMajor(majorId, majorData);

    res.status(200).json({
      status: 'success',
      data: {
        major,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMajor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const majorId = req.params.id;
    await majorService.deleteMajor(majorId);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateMajors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await majorService.updateMajors();

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
