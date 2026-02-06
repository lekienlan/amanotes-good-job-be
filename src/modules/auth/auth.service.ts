import { GoogleProfile } from './auth.types';
import { prisma } from '../../config';
import { User, Role } from '../../../generated/prisma/client';

/**
 * Find or create user from Google profile
 * @param googleProfile - Google OAuth profile data
 * @returns User object
 */
export const findOrCreateUser = async (googleProfile: GoogleProfile): Promise<User> => {
  const { email, firstName, lastName, picture } = googleProfile;

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email }
  });

  // Create new user if doesn't exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        avatar: picture || null,
        points_balance: 0,
        giving_budget: 0,
        role: Role.USER,
        department: null,
        last_budget_reset: null
      }
    });
  }

  return user;
};

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
