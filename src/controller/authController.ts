import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import * as authService from '../service/authService';

export const join = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    // FIXME: 지금은 테스트를 위해서 유저 정보를 리턴받는데 나중에는 안 받아도 됨.
    const newUser = await authService.join(userData);

    res.status(201).json({
      status: 'success',
      data: {
        message: `회원가입이 완료되었습니다.`,
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
    const { isRememberOn } = req.body;
    // FIXME: 지금은 테스트를 위해서 유저 정보를 리턴받는데 나중에는 안 받아도 됨.
    const { updatedUser, accessToken, refreshToken } = await authService.login(
      req.body,
    );

    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    if (isRememberOn) {
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
        accessToken,
        refreshToken: isRememberOn ? refreshToken : undefined,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  await authService.logout(req.cookies.accessToken);
  req.userId = undefined;
  req.userRole = undefined;
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

export const nicknameCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nickname } = req.body;

    const isSuccess = await authService.nicknameCheck(nickname);

    res.status(200).json({
      isSuccess: isSuccess,
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userEmail } = req.body;
    await authService.forgotPassword(userEmail);

    res.status(200).json({
      status: 'success',
      message: `${userEmail}로 임시 비밀번호를 보냈습니다.`,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId as Types.ObjectId;
    const { oldPassword, newPassword } = req.body;

    await authService.resetPassword(userId, oldPassword, newPassword);

    res.status(200).json({
      status: 'success',
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};
