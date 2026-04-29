import { authMiddleware } from '@lib/server/middlewares/auth';
import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await authMiddleware(req, res))) return;

  if (req.method === 'POST') {
    deleteCookie('token', { req, res });
    return res.status(200).json({ message: 'You have logged out successfully.' });
  }
}
