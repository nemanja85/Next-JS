import { authMiddleware } from '@lib/server/middlewares/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  authMiddleware(req, res);

  if (req.method === 'GET') {
    return res.status(200).json({
      res: true,
    });
  }
}
