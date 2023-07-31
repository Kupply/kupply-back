import { NextFunction, Request, Response } from 'express';
import Major from '../models/majorModel';

export const getAllMajors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const majors = await Major.find();
    return majors;
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
    const major = await Major.create(req.body);
    return major;
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
    const major = await Major.findById(req.params.id);
    return major;
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
    const major = await Major.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return major;
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
    const major = await Major.findByIdAndDelete(req.params.id);
    return major;
  } catch (err) {
    next(err);
  }
};
