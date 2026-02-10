/**
 * Reward service - database/API integration logic
 * Handles all CRUD operations for rewards
 */

import { prisma } from '../../config';
import { pagination } from '../pagination';
import type { PaginationParam } from '../pagination/pagination.types';
import type { CreateRewardInput, UpdateRewardInput } from './reward.types';

/**
 * Create a new reward
 */
export const createReward = async (data: CreateRewardInput) => {
  // Reason: rewards are standalone entities; no side-effects on users here.
  return prisma.reward.create({
    data
  });
};

/**
 * Get reward by ID
 */
export const getRewardById = async (id: string) => {
  return prisma.reward.findUnique({ where: { id } });
};

/**
 * Get paginated rewards with optional filters
 */
export const getRewards = async (params: PaginationParam & { is_active?: boolean | string }) => {
  const { is_active, ...paginationParams } = params;

  const where = {
    ...(is_active !== undefined && {
      is_active: typeof is_active === 'string' ? is_active === 'true' : is_active
    })
  };

  return pagination(prisma.reward, {
    ...paginationParams,
    where: Object.keys(where).length > 0 ? where : undefined,
    sort_by: params.sort_by ?? 'created_at',
    direction: params.direction ?? 'desc'
  });
};

/**
 * Update reward by ID
 */
export const updateReward = async (id: string, data: UpdateRewardInput) => {
  return prisma.reward.update({
    where: { id },
    data
  });
};

/**
 * Delete reward by ID
 */
export const deleteReward = async (id: string) => {
  return prisma.reward.delete({ where: { id } });
};
