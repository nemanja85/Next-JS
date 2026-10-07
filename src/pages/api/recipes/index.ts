import { authMiddleware } from '@lib/server/middlewares/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!(await authMiddleware(req, res))) return;
    return res.status(200).json({
      res: true,
    });
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
