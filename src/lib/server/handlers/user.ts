import * as userService from '@lib/server/services/user.service';
import { mapErrors } from '@lib/utils';
import { schema } from '@lib/validations';
import { User } from '@prisma/client';
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

    return res.status(201).send({ id: result.id });
  } catch (error) {
    switch ((error as Error).name) {
      case 'ValidationError':
        return res.status(422).send({ errors: mapErrors(error as ValidationError) });
      default:
        return res.status(409).send({ message: 'Email address already exists.' });
    }
  }
};

export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.query.fields as string | undefined;
  const users = await userService.findManyUsers(fields);

  return res.status(200).send({ data: users });
};

export const getUser = async (_req: NextApiRequest, res: NextApiResponse, id: number) => {
  const user = await userService.findUserById(id);

  if (user === null) {
    return res.status(404).send({ message: 'User not found.' });
  }

  return res.status(200).send(user);
};

export const updateUser = async (req: NextApiRequest, res: NextApiResponse, id: number) => {
  const user = await userService.findUserById(id);

  if (user === null) {
    return res.status(404).send({ message: 'User not found.' });
  }

  const body = req.body as CreateUserRequest;

  try {
    await schema.validate(body, { abortEarly: false });

    await userService.updateUser(id, {
      email: body.email,
      password: body.password,
    });

    return res.status(204).send(null);
  } catch (err) {
    return res.status(422).send({ errors: mapErrors(err as ValidationError) });
  }
};

export const deleteUser = async (res: NextApiResponse, id: number) => {
  try {
    await userService.deleteUser(id);

    return res.status(204).send(undefined);
  } catch (err) {
    return res.status(404).send({ message: 'User not found.' });
  }
};
