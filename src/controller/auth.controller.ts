import { CookieOptions, NextFunction, Request, Response } from "express";
import config from "config";
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
  signTokens
} from "../services/user.service";
import { User } from "../entities/user.entity";
import AppError from "../utils/appError";
import { verifyJwt } from "../utils/jwt";
import redisClient from "../utils/connectRedis";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax"
};

if (process.env.NODE_ENV === "production") {
  cookiesOptions.secure = true;
}

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000
};

const logout = (res: Response) => {
  res.cookie("access_token", "", {
    maxAge: -1
  });
  res.cookie("refresh_token", "", { maxAge: -1 });
  res.cookie("logged_in", "", { maxAge: -1 });
};

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const user = await createUser({
      email: email.toLowerCase(),
      password,
      name
    });

    res.status(201).json({
      status: "success",
      data: {
        user
      }
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with that email already exist"
      });
    }
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail({ email });

    if (!user || !(await User.comparePasswords(password, user.password))) {
      return next(new AppError(400, "Invalid email or password"));
    }

    const { accessToken, refreshToken } = await signTokens(user);

    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    });

    res.status(200).json({
      status: "success",
      accessToken
    });
  } catch (err: any) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;
    const message = "Could not refresh access token. Please login again.";

    if (!refreshToken) {
      return next(new AppError(403, message));
    }

    const decodedToken = verifyJwt<{ sub: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );

    if (!decodedToken) {
      return next(new AppError(403, message));
    }

    const session = await redisClient.get(decodedToken.sub);

    if (!session) {
      return next(new AppError(403, message));
    }

    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(new AppError(403, message));
    }

    const { accessToken } = await signTokens(user);

    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    });

    res.status(200).json({
      status: "success",
      accessToken
    });
  } catch (err: any) {
    next(err);
  }
};

export const logoutUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    await redisClient.del(user.id);
    logout(res);

    res.status(200).json({
      status: "success"
    });
  } catch (err: any) {
    next(err);
  }
};
