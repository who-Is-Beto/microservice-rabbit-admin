import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { verifyJwt } from '../utils/jwt';
import { findUserById } from '../services/user.service';
import redisClient from '../utils/connectRedis';

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken: string = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      accessToken = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      accessToken = req.cookies.access_token as string;
    }

    if (!accessToken) {
      return next(new AppError(401, 'You are not logged in. Please log in to get access.'));
    }

    const decodedToken = verifyJwt<{ sub: string }>(accessToken, 'accessTokenPublicKey');

    if (!decodedToken)
      return next(new AppError(401, 'Invalid token or session expired. Please log in again.'));

    const session = await redisClient.get(decodedToken.sub);

    if (!session) {
      return next(new AppError(401, 'Invalid token or session expired. Please log in again.'));
    }
    const user = await findUserById(JSON.parse(session).userId);

    if (!user) {
      return next(new AppError(401, 'Invalid token or session expired. Please log in again.'));
    }

    res.locals.user = user;
    next();
  } catch (err: any) {
    next(err);
  }
};
