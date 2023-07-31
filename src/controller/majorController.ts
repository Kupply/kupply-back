import { NextFunction, Request, Response } from 'express';
import * as majorService from '../service/majorService';

export const getAllMajors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const majors = await majorService.getAllMajors(req, res, next);

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
    const newMajor = await majorService.createMajor(req, res, next);

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
    const major = await majorService.getMajor(req, res, next);

    if (!major) {
      throw { status: 404, message: 'No major found with this id' };
    }

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
    const major = await majorService.updateMajor(req, res, next);

    if (!major) {
      throw { status: 404, message: 'No major found with this id' };
    }

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
    const major = majorService.deleteMajor(req, res, next);

    if (!major) {
      throw { status: 404, message: 'No major found with this id' };
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
