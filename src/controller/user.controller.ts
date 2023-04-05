import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";

export const getMeHandler = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user as User;

    res.status(200).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (err: any) {
    next(err);
  }
};
