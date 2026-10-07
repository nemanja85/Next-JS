import { verifyToken } from '@lib/server/services/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

type Response = {
  message: string;
};

export const authMiddleware = async (req: NextApiRequest, res: NextApiResponse<Response>): Promise<boolean> => {
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
    const payload = await verifyToken(token);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log('Token has expired.');
      res.status(401).send({ message: 'You are unauthorized.' });
      return false;
    }
    return true;
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError') {
      res.status(401).send({ message: 'You are unauthorized.' });
      return false;
    }

    res.status(400).send({ message: 'Only bearer (JWT) tokens allowed.' });
    return false;
  }
};
