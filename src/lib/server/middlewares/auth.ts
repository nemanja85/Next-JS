import { readFile } from 'fs/promises';
import { JsonWebTokenError, JwtPayload, verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

type Response = {
  message: string;
};

export const authMiddleware = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: 'You are unauthorized.' });
  }

  const key = await readFile(`${process.cwd()}/keys/public.pem`);
  try {
    const payload = verify(token, key, {
      algorithms: ['RS256'],
      issuer: 'NextJS',
    }) as JwtPayload;

    if (Date.now() >= payload.exp! * 1000) {
      console.log('Token has expired.');

      return res.status(401).send({ message: 'You are unauthorized.' });
    }
  } catch (err) {
    if ((err as JsonWebTokenError).name === 'JsonWebTokenError') {
      return res.status(400).send({ message: 'Invalid token.' });
    }
  }
};
