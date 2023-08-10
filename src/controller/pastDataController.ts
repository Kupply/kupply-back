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

  export const getPastData_major = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = new Types.ObjectId('64cbc30b50187afa2c0fddce'); //임의로 설정하였고, 원래대로라면 request에서 받아야 함.
      const majorID = req.params.id;  //id를 받아 온다.

      const pastData = await pastDataService.getPastData_major(userId, Number(majorID)); //user Data를 찾아서 보낸다.
      res.send(pastData);
    } catch (err) {
      next(err);
    }
  };