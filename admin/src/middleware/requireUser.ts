import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

export const requireUser = (_: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return next(
        new AppError(401, "You must be logged in to access this route.")
      );
    }
    next();
  } catch (err: any) {
    next(err);
  }
};
