/**
 * User controller - request/response handling
 * Separates HTTP layer from database logic
 */

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../../config';
import { getUsers, getUserById, updateUserById } from './user.service';
import { PaginationParam } from '../pagination';
import type { UpdateUserInput } from './user.types';

/**
 * Transform Prisma user to API response format (snake_case)
 */
const toUserResponse = (user: any) => ({
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
 * GET /users - List all users with pagination (all roles)
 */
export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const { page, limit, sort_by, direction, pick, populate } = req.query;

    const params: PaginationParam = {
      ...(page && { page: Number(page) }),
      ...(limit && { limit: Number(limit) }),
      ...(sort_by && { sort_by: sort_by as string }),
      ...(direction && { direction: direction as string }),
      ...(pick && { pick: pick as string }),
      ...(populate && { populate: populate as string })
    };

    const result = await getUsers(params);
    res.json({
      data: result.data.map(toUserResponse),
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(
      `getUsersHandler: failed to fetch users - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch users'
    });
  }
};

/**
 * GET /users/:id - Get user by ID
 */
export const getUserByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'User not found'
      });
    }

    res.json(toUserResponse(user));
  } catch (error) {
    logger.error(
      `getUserByIdHandler: failed to fetch user - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch user'
    });
  }
};

/**
 * PATCH /users/:id - Update user by ID (e.g. giving_budget, first_name, last_name)
 */
export const patchUserByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateUserInput;

    // Allow only known updatable fields (ignore id, email, created_at, etc.)
    const allowedKeys: (keyof UpdateUserInput)[] = [
      'giving_budget',
      'first_name',
      'last_name',
      'avatar',
      'department',
      'role',
      'points_balance',
      'last_budget_reset'
    ];
    const data: UpdateUserInput = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        (data as Record<string, unknown>)[key] = body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Bad Request',
        error: 'No valid fields to update'
      });
    }

    const user = await updateUserById(id, data);
    res.json(toUserResponse(user));
  } catch (error: unknown) {
    // Reason: Prisma throws when record not found or constraint violated
    const prismaNotFound =
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: string }).code === 'P2025';
    if (prismaNotFound) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'User not found'
      });
    }
    logger.error(
      `patchUserByIdHandler: failed to update user - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to update user'
    });
  }
};
