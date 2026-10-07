import { setCookie, deleteCookie } from 'cookies-next';
import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { JwtPayload, sign, SignOptions, verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

let privateKeyCache: Buffer | null = null;
let publicKeyCache: Buffer | null = null;

const getPrivateKey = async (): Promise<Buffer> => {
  if (!privateKeyCache) {
    privateKeyCache = await readFile(path.join(process.cwd(), 'keys', 'private.pem'));
  }
  return privateKeyCache;
};

const getPublicKey = async (): Promise<Buffer> => {
  if (!publicKeyCache) {
    publicKeyCache = await readFile(path.join(process.cwd(), 'keys', 'public.pem'));
  }
  return publicKeyCache;
};

export const signToken = async (payload: { role: string }, userId: number | string): Promise<string> => {
  const secret = await getPrivateKey();

  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '1h',
    issuer: 'NextJS',
    jwtid: randomUUID(),
    subject: userId.toString(),
  };

  return new Promise((resolve, reject) => {
    sign(payload, secret, options, (err, token) => {
      if (err || !token) {
        reject(err ?? new Error('Failed to generate token'));
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secret = await getPublicKey();

  return new Promise((resolve, reject) => {
    verify(
      token,
      secret,
      {
        algorithms: ['RS256'],
        issuer: 'NextJS',
      },
      (err, decoded) => {
        if (err || !decoded) {
          reject(err ?? new Error('Invalid token'));
        } else {
          resolve(decoded as JwtPayload);
        }
      }
    );
  });
};

export const setAuthCookie = (req: NextApiRequest, res: NextApiResponse, token: string): void => {
  setCookie('token', token, {
    req,
    res,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600, // 1 hour in seconds, aligned with JWT expiration
  });
};

export const removeAuthCookie = (req: NextApiRequest, res: NextApiResponse): void => {
  deleteCookie('token', { req, res });
};
