import { authMiddleware } from '@lib/server/middlewares/auth';
import { removeCookies } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  authMiddleware(req, res);

  if (req.method === 'POST') {
    removeCookies('token', { req, res });
    return res.status(200).json({ message: 'You have logged out successfully.' });
  }
}
