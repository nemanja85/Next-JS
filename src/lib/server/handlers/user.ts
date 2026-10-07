import * as userService from '@lib/server/services/user.service';
import { mapErrors } from '@lib/utils';
import { schema } from '@lib/validations';
import { Prisma, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

type CreateUserResponse = { errors: { field: string; message: string }[] } | { id: number };

export type CreateUserRequest = Omit<User, 'id' | 'role' | 'updatedAt' | 'createdAt'>;

export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateUserResponse | { message: string }>
) => {
  const body = req.body as CreateUserRequest;
  try {
    await schema.validate(body, { abortEarly: false });

    const result = await userService.createUser({
      email: body.email,
      password: body.password,
    });

    return res.status(201).json({ id: result.id });
  } catch (error) {
    if ((error as Error).name === 'ValidationError') {
      return res.status(422).json({ errors: mapErrors(error as ValidationError) });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ message: 'Email address already exists.' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const fields = req.query.fields as string | undefined;
    const users = await userService.findManyUsers(fields);

    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUser = async (_req: NextApiRequest, res: NextApiResponse, id: number) => {
  try {
    const user = await userService.findUserById(id);

    if (user === null) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: NextApiRequest, res: NextApiResponse, id: number) => {
  const body = req.body as CreateUserRequest;

  try {
    await schema.validate(body, { abortEarly: false });

    await userService.updateUser(id, {
      email: body.email,
      password: body.password,
    });

    return res.status(204).end();
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      return res.status(422).json({ errors: mapErrors(err as ValidationError) });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'User not found.' });
      }
      if (err.code === 'P2002') {
        return res.status(409).json({ message: 'Email address already exists.' });
      }
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (res: NextApiResponse, id: number) => {
  try {
    await userService.deleteUser(id);

    return res.status(204).end();
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};
