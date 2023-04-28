import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { createPost } from '../services/post.service';
import { CreatePostInput } from '../schemas/post.schema';

export const createPostHandler = async (
  req: Request<{}, {}, CreatePostInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user as User;

    const post = await createPost({
      ...req.body,
      user_id: user.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
