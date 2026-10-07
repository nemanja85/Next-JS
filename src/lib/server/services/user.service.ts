import { prisma } from '@lib/prisma';
import { mapFilter } from '@lib/utils';
import { hashPassword } from '@lib/server/utils/password';
import { Prisma, User } from '@prisma/client';

export type CreateUserData = {
  email: string;
  password: string;
};

export type UpdateUserData = {
  email: string;
  password: string;
};

export const findManyUsers = async (fields?: string) => {
  if (fields) {
    const columns = fields.split(',').filter(Boolean) as Array<keyof User>;
    const mappings = mapFilter<User>(columns);
    if (Object.keys(mappings).length > 0) {
      return prisma.user.findMany({
        select: mappings as Prisma.UserSelect,
      });
    }
  }

  return prisma.user.findMany();
};

export const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      id,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });
};

export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });
};

export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};
