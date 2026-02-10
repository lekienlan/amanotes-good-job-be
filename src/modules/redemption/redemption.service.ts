/**
 * Redemption service - database/API integration logic
 * Handles CRUD operations for redemptions
 */

import { prisma } from '../../config';
import { pagination } from '../pagination';
import type { PaginationParam } from '../pagination/pagination.types';
import type { CreateRedemptionInput, UpdateRedemptionInput } from './redemption.types';

/**
 * Create a new redemption
 */
export const createRedemption = async (data: CreateRedemptionInput) => {
  // Reason: redemption creation may later include user balance checks; keep in one place.
  return prisma.redemption.create({
    data,
    include: { user: true, reward: true }
  });
};

/**
 * Get redemption by ID
 */
export const getRedemptionById = async (id: string) => {
  return prisma.redemption.findUnique({
    where: { id },
    include: { user: true, reward: true }
  });
};

/**
 * Get paginated redemptions with optional filters
 */
export const getRedemptions = async (
  params: PaginationParam & { user_id?: string; reward_id?: string; status?: string }
) => {
  const { user_id, reward_id, status, ...paginationParams } = params;

  const where = {
    ...(user_id && { user_id }),
    ...(reward_id && { reward_id }),
    ...(status && { status })
  };

  return pagination(prisma.redemption, {
    ...paginationParams,
    where: Object.keys(where).length > 0 ? where : undefined,
    sort_by: params.sort_by ?? 'created_at',
    direction: params.direction ?? 'desc',
    populate: params.populate ?? 'user,reward'
  });
};

/**
 * Update redemption by ID
 */
export const updateRedemption = async (id: string, data: UpdateRedemptionInput) => {
  return prisma.redemption.update({
    where: { id },
    data,
    include: { user: true, reward: true }
  });
};

/**
 * Delete redemption by ID
 */
export const deleteRedemption = async (id: string) => {
  return prisma.redemption.delete({ where: { id } });
};
