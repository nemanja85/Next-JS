import { findUserByEmail } from '@lib/server/services/user.service';
import { signToken } from '@lib/server/services/jwt';
import { verifyPassword } from '@lib/server/utils/password';
import { User } from '@prisma/client';

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResult = {
  user: User;
  token: string;
};

export const authenticateUser = async (credentials: LoginCredentials): Promise<User> => {
  const user = await findUserByEmail(credentials.email);

  if (!user) {
    throw new AuthError('No User in database', 400);
  }

  const passwordMatches = await verifyPassword(credentials.password, user.password);

  if (!passwordMatches) {
    throw new AuthError('Password kaput', 400);
  }

  return user;
};

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResult> => {
  const user = await authenticateUser(credentials);

  try {
    const token = await signToken({ role: user.role }, user.id);
    return { user, token };
  } catch (err) {
    console.error('Error generating token:', err);
    throw new AuthError('Error while generating JWT.', 400);
  }
};
