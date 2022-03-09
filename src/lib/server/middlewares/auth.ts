import { readFile } from 'fs/promises';
import { JwtPayload, verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export const authMiddleware = async (req: NextApiRequest, res: NextApiResponse) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: 'You are unauthorized.' });
  }

  const [type, token] = authorization?.split(' ')!;

  if (type !== 'Bearer') {
    return res.status(400).json({ message: 'Only bearer tokens allowed.' });
  }

  const key = await readFile(`${process.cwd()}/keys/public.pem`);

  const payload = verify(token, key, {
    algorithms: ['RS256'],
    issuer: 'NextJS',
  }) as JwtPayload;

  if (Date.now() >= payload.exp! * 1000) {
    console.log('Token has expired.');

    return res.status(401).json({ message: 'You are unauthorized.' });
  }
};
