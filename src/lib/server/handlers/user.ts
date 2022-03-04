import { prisma } from '@lib/prisma';
import { mapErrors, mapFilter } from '@lib/utils';
import { schema } from '@lib/validations';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

type CreateUserResponse = { errors: { field: string; message: string }[] } | { id: number };

type CreateUserRequest = Omit<User, 'id' | 'role' | 'updatedAt' | 'createdAt'>;

export const createUser = async (req: NextApiRequest, res: NextApiResponse<CreateUserResponse>) => {
  const body = req.body as CreateUserRequest;
  try {
    await schema.validate(body, { abortEarly: false });

    const hashedPassword = await hash(body.password, 10);

    const result = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });

    return res.status(201).send({ id: result.id });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    switch (error.name) {
      case 'ValidationError':
        return res.status(422).send({ errors: mapErrors(error as ValidationError) });
      default:
        // @ts-ignore
        return res.status(500).send({ error });
    }
  }
};

export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const fields = req.query.fields as string;

  const mappings = mapFilter<User>(fields?.split(',') as Array<keyof User>);

  const args = {} as Record<any, string>;

  if (Object.keys(mappings).length > 0) {
    // @ts-ignore
    args['select'] = mappings;
  }

  // @ts-ignore
  return res.status(200).send({ data: await prisma.user.findMany(args) });
};

export const getUser = async (_req: NextApiRequest, res: NextApiResponse, id: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user === null) {
    return res.status(404).send({ message: 'User not found' });
  }

  return res.status(200).send(user);
};

export const updateUser = async (req: NextApiRequest, res: NextApiResponse, id: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (user === null) {
    return res.status(404).send({ message: 'User not found' });
  }

  const body = req.body as CreateUserRequest;

  try {
    await schema.validate(body, { abortEarly: false });

    const hashedPassword = await hash(body.password, 10);

    await prisma.user.update({
      data: {
        email: body.email,
        password: hashedPassword,
      },
      where: {
        id,
      },
    });

    return res.status(204).send(null);
  } catch (err) {
    console.log(err);

    return res.status(422).send({ errors: mapErrors(err as ValidationError) });
  }
};

export const deleteUser = async (res: NextApiResponse, id: number) => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(204).send(undefined);
  } catch (err) {
    // @ts-ignore
    return res.status(404).send({ message: err.meta.cause });
  }
};
