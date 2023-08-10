import { NextFunction, Request, Response } from 'express';
import * as authService from '../service/authService';

export const join = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const newUser = await authService.join(userData);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.body;
    const { updatedUser, accessToken, refreshToken } = await authService.login(
      userData,
    );

    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  await authService.logout(req.cookies.accessToken);
  res.clearCookie('accessToken', { httpOnly: true });
  res.clearCookie('refreshToken', { httpOnly: true });
  res.status(200).json({ status: 'success' });
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, newAccessToken } = await authService.protect(
      req.cookies.accessToken,
      req.cookies.refreshToken,
    );

    req.user = user;
    if (newAccessToken !== '') {
      res.cookie('accessToken', newAccessToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
