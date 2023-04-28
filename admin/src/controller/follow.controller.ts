import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { createFollow, getFollowers } from '../services/follow.service';
import { CreateFollowInput } from '../schemas/follow.schema';

export const followHandler = async (
  req: Request<{}, {}, CreateFollowInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_from_id, user_to_id } = req.body;

    const follow = await createFollow({ user_from_id, user_to_id });
    res.status(200).json({
      status: 'success',
      data: {
        follow,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getFollowersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user as User;

    const followers = await getFollowers(user.id);

    res.status(200).json({
      status: 'success',
      data: {
        followers,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
