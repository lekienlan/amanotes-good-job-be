import crypto from 'crypto';
import { GoogleProfile } from './auth.types';
import { prisma, redis } from '../../config';
import { AUTH_CODE_TTL_SECONDS } from '../../config/redis';
import { User, Role } from '../../../generated/prisma/client';

const AUTH_CODE_PREFIX = 'auth:code:';

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

/**
 * Store access and refresh tokens in Redis under a one-time code.
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 * @returns The one-time code to pass to the frontend
 * @throws Error if Redis is unavailable
 */
export const storeTokensByCode = async (
  accessToken: string,
  refreshToken: string
): Promise<string> => {
  if (!redis) {
    throw new Error('Redis unavailable');
  }
  const code = crypto.randomBytes(24).toString('hex');
  const key = `${AUTH_CODE_PREFIX}${code}`;
  const value = JSON.stringify({ accessToken, refreshToken });
  await redis.set(key, value, 'EX', AUTH_CODE_TTL_SECONDS);
  return code;
};

/**
 * Retrieve tokens by one-time code and delete the key (one-time use).
 * @param code - The code from the frontend
 * @returns Tokens or null if code is invalid/expired or Redis is disabled
 */
export const getAndDeleteTokensByCode = async (
  code: string
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  if (!redis) return null;
  const key = `${AUTH_CODE_PREFIX}${code}`;
  const value = await redis.get(key);
  if (!value) return null;
  await redis.del(key);
  try {
    return JSON.parse(value) as { accessToken: string; refreshToken: string };
  } catch {
    return null;
  }
};
