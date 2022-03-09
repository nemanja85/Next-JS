import { prisma } from '@lib/prisma';
import { mapErrors } from '@lib/utils';
import { schema } from '@lib/validations';
import { compare } from 'bcryptjs';
import { setCookies } from 'cookies-next';
import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { sign, SignOptions } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body as LoginRequest;

    await schema.validate(body, { abortEarly: false });

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'No User in database',
      });
    }

    const passwordMatches = await compare(body.password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({
        message: 'Password kaput',
      });
    }

    const payload = {
      role: user.role,
    };

    const secret = await readFile(`${process.cwd()}/keys/private.pem`);

    const options = {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'NextJS',
      jwtid: randomUUID(),
      subject: user.id.toString(),
    } as SignOptions;

    sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err);

        return res.status(400).json({ message: 'Error while generating JWT.' });
      }

      setCookies('token', token, {
        req,
        res,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 86400, // day in seconds
      });
      // res.setHeader('Set-Cookie', '');
      return res.status(200).json({
        token,
      });
    });
  } catch (err) {
    switch ((err as Error).name) {
      case 'ValidationError':
        return res.status(422).send({
          errors: mapErrors(err as ValidationError),
        });
    }
  }
};
