import { readFile } from 'fs/promises';
import { JwtPayload, verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

type Response = {
  message: string;
};

export const authMiddleware = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  let token = req.cookies.token;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    if (!authHeader.startsWith('Bearer ')) {
      res.status(400).send({ message: 'Only bearer (JWT) tokens allowed.' });
      return false;
    }
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401).send({ message: 'You are unauthorized.' });
    return false;
  }

  try {
    const key = await readFile(`${process.cwd()}/keys/public.pem`);
    const payload = verify(token, key, {
      algorithms: ['RS256'],
      issuer: 'NextJS',
    }) as JwtPayload;

    if (Date.now() >= payload.exp! * 1000) {
      console.log('Token has expired.');

      res.status(401).send({ message: 'You are unauthorized.' });
      return false;
    }
    return true;
  } catch (err) {
    res.status(400).send({ message: 'Only bearer (JWT) tokens allowed.' });
    return false;
  }
};
