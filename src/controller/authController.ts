import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import * as authService from '../service/authService';

// export const join = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userData = req.body;
//     // FIXME: 지금은 테스트를 위해서 유저 정보를 리턴받는데 나중에는 안 받아도 됨.
//     const newUser = await authService.join(userData);

//     res.status(201).json({
//       status: 'success',
//       data: {
//         message: `회원가입이 완료되었습니다.`,
//         user: newUser,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// };

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      updatedUser,
      accessToken,
      refreshToken,
      accessTokenExpire,
      refreshTokenExpire,
    } = await authService.login(req.body);

    res.cookie('accessToken', accessToken, {
      expires: accessTokenExpire,
      httpOnly: false,
    });
    res.cookie('refreshToken', refreshToken, {
      expires: refreshTokenExpire,
      httpOnly: false,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
        accessToken,
        accessTokenExpire: accessTokenExpire.getTime(),
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const koreapasJoin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.body;
    await authService.koreapasJoin(userData);

    res.status(201).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const koreapasLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: koreapasId, password: koreapasPassword } = req.body;

    const data = await authService.koreapasLogin(koreapasId, koreapasPassword);

    res.status(200).json({
      status: 'success',
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const koreapasVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uuid: koreapasUUID } = req.body;

    const data = await authService.koreapasVerify(koreapasUUID);

    res.status(200).json({
      status: 'success',
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  let refreshToken = '';
  if (req.headers.authorization) {
    refreshToken = req.headers.authorization.split(' ')[1];
  }
  await authService.logout(refreshToken);
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
    let token = '';
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    const { userId, userRole } = await authService.protect(token);

    req.userId = userId;
    req.userRole = userRole;

    next();
  } catch (err) {
    next(err);
  }
};

// export const protect = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { userId, userRole, newAccessToken } = await authService.protect(
//       req.cookies.accessToken,
//       req.cookies.refreshToken,
//     );

//     req.userId = userId;
//     req.userRole = userRole;

//     if (newAccessToken !== '') {
//       const accessTokenExpire = new Date();
//       accessTokenExpire.setHours(accessTokenExpire.getHours() + 10); // 한국시간 시차 9시간, 만료 시간 1시간

//       res.cookie('accessToken', newAccessToken, {
//         expires: accessTokenExpire,
//         httpOnly: true,
//       });
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let refreshToken = '';
    if (req.headers.authorization) {
      refreshToken = req.headers.authorization.split(' ')[1];
    }

    const { newAccessToken, newAccessTokenExpire } =
      await authService.refreshAccessToken(req.body.accessToken, refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: newAccessToken,
        accessTokenExpire: newAccessTokenExpire.getTime(),
      },
    });
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
