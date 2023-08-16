import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';

interface JwtPayload {
  id: string;
}

export const createToken = (user: IUser) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '1h',
  });

  return accessToken;
};

export const createRefreshToken = () => {
  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET_KEY!, {
    expiresIn: '30d',
  });

  return refreshToken;
};

export const createCertificateToken = (user: IUser) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_CERTIFICATE_SECRET_KEY!,
    {
      expiresIn: '1h',
    },
  );

  return accessToken;
};

export const verifyToken = (accessToken: string) => {
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY!,
    ) as JwtPayload;

    return id;
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY!);
    return true;
  } catch (err) {
    return false;
  }
};

export const decodeToken = (accessToken: string) => {
  const { id } = jwt.decode(accessToken) as JwtPayload;
  return id;
};
