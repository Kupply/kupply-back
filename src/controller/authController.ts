import { NextFunction, Request, Response } from 'express';
import * as authService from '../service/authService';

export const join = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    // FIXME: 지금은 테스트를 위해서 유저 정보를 리턴받는데 나중에는 안 받아도 됨.
    const newUser = await authService.join(userData);

    res.status(201).json({
      status: 'success',
      data: {
        message: `${newUser.email}로 인증 링크를 보냈습니다. 이메일 인증을 하여 회원가입을 완료해주세요.`,
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
    // FIXME: 지금은 테스트를 위해서 유저 정보를 리턴받는데 나중에는 안 받아도 됨.
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
    const { userId, userRole, newAccessToken } = await authService.protect(
      req.cookies.accessToken,
      req.cookies.refreshToken,
    );

    req.userId = userId;
    req.userRole = userRole;

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

export const sendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    await authService.sendEmail(email);

    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const certifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, code } = req.body;

    await authService.certifyEmail(email, code);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (err) {
    next(err);
  }
};
