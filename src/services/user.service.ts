import config from "config";
import { DeepPartial } from "typeorm";
import { User } from "../entities/user.entity";
import redisClient from "../utils/connectRedis";
import { AppDataSource } from "../utils/data-source";
import { signJWT } from "../utils/jwt";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: DeepPartial<User>) => {
  return userRepository.save(userRepository.create(input));
};

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepository.findOneBy({ id: userId });
};

export const findUser = async (query: Object) => {
  return await userRepository.findOneBy(query);
};

export const signTokens = async (user: User) => {
  redisClient.set(user.id, JSON.stringify(user), {
    EX: config.get<number>("redisCacheExpiresIn") * 60
  });

  const accessToken = signJWT({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`
  });

  const refreshToken = signJWT({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`
  });

  return { accessToken, refreshToken };
};
