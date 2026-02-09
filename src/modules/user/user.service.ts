/**
 * User service - database/API integration logic
 * Handles user read and update operations
 */

import { prisma } from '../../config';
import { pagination, PaginationParam } from '../../middlewares/pagination';
import type { UpdateUserInput } from './user.types';

/**
 * Get paginated users (all roles)
 */
export const getUsers = async (params: PaginationParam) => {
  return await pagination(prisma.user, {
    ...params,
    sort_by: params.sort_by ?? 'created_at',
    direction: params.direction ?? 'desc'
  });
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

/**
 * Update user by ID (partial update, e.g. giving_budget)
 */
export const updateUserById = async (id: string, data: UpdateUserInput) => {
  return await prisma.user.update({
    where: { id },
    data
  });
};
