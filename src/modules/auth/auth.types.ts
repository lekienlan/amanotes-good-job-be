import { User } from '@prisma/client';

/**
 * Google profile data from OAuth
 */
export interface GoogleProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Login response with tokens and user data
 */
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Express Request with authenticated user
 */
export interface AuthRequest extends Express.Request {
  user?: User;
}
