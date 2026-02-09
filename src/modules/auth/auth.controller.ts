import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from '../../../generated/prisma/client';
import config from '../../config/config';
import { redis } from '../../config';
import { generateTokens } from '../../utils/jwt.util';
import { getAndDeleteTokensByCode, storeTokensByCode } from './auth.service';

/**
 * Transform User to API response format (snake_case)
 */
const toUserResponse = (user: User) => ({
  id: user.id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  avatar: user.avatar,
  points_balance: user.points_balance,
  giving_budget: user.giving_budget,
  last_budget_reset: user.last_budget_reset,
  role: user.role,
  department: user.department,
  created_at: user.created_at,
  updated_at: user.updated_at
});

/**
 * GET /me - Get current authenticated user
 */
export const getMe = (req: Request, res: Response) => {
  const user = req.user as User;

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Unauthorized',
      error: 'Authentication required'
    });
  }

  res.json(toUserResponse(user));
};

/**
 * Google OAuth callback handler
 * Stores tokens in Redis under a one-time code and redirects to frontend with that code.
 */
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    if (!user) {
      return res.redirect(`${config.frontend.url}/login?error=authentication_failed`);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    try {
      const code = await storeTokensByCode(accessToken, refreshToken);
      return res.redirect(`${config.frontend.url}/login?code=${code}`);
    } catch {
      return res.redirect(`${config.frontend.url}/login?error=redis_unavailable`);
    }
  } catch (error) {
    console.error('Error in googleCallback:', error);
    return res.redirect(`${config.frontend.url}/login?error=server_error`);
  }
};

/**
 * POST /auth/token - Exchange one-time code for access and refresh tokens.
 * Body: { code: string }. Code is consumed (one-time use).
 */
export const exchangeTokenByCode = async (req: Request, res: Response) => {
  if (!redis) {
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json({
      message: 'Service Unavailable',
      error: 'Token exchange is unavailable'
    });
  }

  const code = req.body?.code;

  if (typeof code !== 'string' || !code.trim()) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Bad Request',
      error: 'code is required'
    });
  }

  const tokens = await getAndDeleteTokensByCode(code.trim());

  if (!tokens) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Unauthorized',
      error: 'invalid or expired code'
    });
  }

  return res.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  });
};

/**
 * Handle authentication failure - redirect to frontend with error
 */
export const authFailure = (req: Request, res: Response) => {
  res.redirect(`${config.frontend.url}/login?error=authentication_failed`);
};
