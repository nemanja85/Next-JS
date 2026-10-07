import { deleteUser, getUser, updateUser } from '@lib/server/handlers/user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = typeof id === 'string' ? parseInt(id, 10) : Number(id);

  if (Number.isNaN(userId) || userId <= 0) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    return await getUser(req, res, userId);
  }

  if (req.method === 'PUT') {
    return await updateUser(req, res, userId);
  }

  if (req.method === 'DELETE') {
    return await deleteUser(res, userId);
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
