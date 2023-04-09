import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';

export const signJWT = (
  payload: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options: SignOptions,
) => {
  const privateKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');
  console.log('privateKey', privateKey, payload, options);
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey',
): T | null => {
  try {
    const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};
