import { AuthError, loginUser } from '@lib/server/services/auth.service';
import { setAuthCookie } from '@lib/server/services/jwt';
import { mapErrors } from '@lib/utils';
import { schema } from '@lib/validations';
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

    const { token } = await loginUser(body);

    setAuthCookie(req, res, token);

    return res.status(200).json({
      token,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    }

    if ((err as Error).name === 'ValidationError') {
      return res.status(422).send({
        errors: mapErrors(err as ValidationError),
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
