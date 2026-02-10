import bcrypt from 'bcryptjs';
import { prisma } from '../../config';
import { User } from '../../../generated/prisma/client';

/**
 * Find user by ID
 * @param userId - User ID
 * @returns User object or null
 */
export const findUserById = async (userId: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id: userId }
  });
};

/**
 * Validate user credentials using user_name and password.
 * @param user_name - The username used for login
 * @param password - The plain text password to verify
 * @returns The authenticated user or null if credentials are invalid
 */
export const validateUserCredentials = async (
  user_name: string,
  password: string
): Promise<User | null> => {
  // Reason: keep auth simple by doing a direct lookup + bcrypt comparison without Passport.
  const user = await (prisma.user as any).findUnique({
    // Type cast is required until Prisma types are regenerated with the new user_name field.
    where: { user_name }
  });

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, (user as any).password);
  if (!isMatch) {
    return null;
  }

  return user;
};
