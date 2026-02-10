import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from '../../../generated/prisma/client';
import { generateTokens } from '../../utils/jwt.util';
import { validateUserCredentials } from './auth.service';

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
 * User is provided by Passport JWT middleware via req.user.
 */
export const getMe = (req: Request, res: Response) => {
  const user = req.user as User | undefined;

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Unauthorized',
      error: 'Authentication required'
    });
  }

  res.json(toUserResponse(user));
};

/**
 * POST /auth/login - Simple username/password login
 * Body: { user_name: string, password: string }
 */
export const login = async (req: Request, res: Response) => {
  const { user_name, password } = req.body || {};

  if (typeof user_name !== 'string' || typeof password !== 'string') {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Bad Request',
      error: '`user_name` and `password` are required as strings'
    });
  }

  const user = await validateUserCredentials(user_name, password);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Unauthorized',
      error: 'Invalid credentials'
    });
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  return res.json({
    user: toUserResponse(user),
    accessToken,
    refreshToken
  });
};
