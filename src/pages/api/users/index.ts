import { createUser, getUsers } from '@lib/server/handlers/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getUsers(req, res);
  }

  if (req.method === 'POST') {
    await createUser(req, res);
  }
}
