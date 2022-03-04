import { deleteUser, getUser, updateUser } from '@lib/server/handlers/user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    await getUser(req, res, +id);
  }

  if (req.method === 'PUT') {
    await updateUser(req, res, +id);
  }

  if (req.method === 'DELETE') {
    await deleteUser(res, +id);
  }
}
