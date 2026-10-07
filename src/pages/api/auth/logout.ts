import { authMiddleware } from '@lib/server/middlewares/auth';
import { removeAuthCookie } from '@lib/server/services/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (!(await authMiddleware(req, res))) return;
    removeAuthCookie(req, res);
    return res.status(200).json({ message: 'You have logged out successfully.' });
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
