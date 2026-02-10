import jwt from 'jsonwebtoken';
import config from '../config/config';

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT access token
 * @param userId - User ID to encode in token
 * @returns JWT access token
 */
export const generateAccessToken = (userId: string): string => {
  const expiresIn = config.jwt.accessExpirationMinutes * 60; // Convert to seconds

  const payload: JWTPayload = {
    userId
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn
  });
};

/**
 * Generate JWT refresh token
 * @param userId - User ID to encode in token
 * @returns JWT refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const expiresIn = config.jwt.refreshExpirationDays * 24 * 60 * 60; // Convert to seconds

  const payload: JWTPayload = {
    userId
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn
  });
};

/**
 * Generate both access and refresh tokens
 * @param userId - User ID to encode in tokens
 * @returns Object with access and refresh tokens
 */
export const generateTokens = (userId: string) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId)
  };
};

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};
