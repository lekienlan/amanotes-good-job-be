/**
 * Reward controller - request/response handling
 * Separates HTTP layer from database logic
 */

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../../config';
import {
  getRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward
} from './reward.service';
import type { PaginationParam } from '../pagination';
import type { CreateRewardInput, UpdateRewardInput } from './reward.types';

/**
 * Transform Prisma reward to API response format (snake_case)
 */
const toRewardResponse = (reward: any) => ({
  id: reward.id,
  name: reward.name,
  description: reward.description,
  points_cost: reward.points_cost,
  image_url: reward.image_url,
  stock: reward.stock,
  is_active: reward.is_active,
  created_at: reward.created_at,
  updated_at: reward.updated_at
});

/**
 * POST /rewards - Create reward
 */
export const createRewardHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateRewardInput;

    if (!body.name || body.points_cost === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Bad Request',
        error: 'name and points_cost are required'
      });
    }

    const reward = await createReward(body);
    res.status(httpStatus.CREATED).json(toRewardResponse(reward));
  } catch (error) {
    logger.error(
      `createRewardHandler: failed to create reward - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to create reward'
    });
  }
};

/**
 * GET /rewards - List rewards with pagination
 */
export const getRewardsHandler = async (req: Request, res: Response) => {
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

    const result = await getRewards(params);
    res.json({
      data: result.data.map(toRewardResponse),
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(
      `getRewardsHandler: failed to fetch rewards - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch rewards'
    });
  }
};

/**
 * GET /rewards/:id - Get reward by ID
 */
export const getRewardByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reward = await getRewardById(id);

    if (!reward) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'Reward not found'
      });
    }

    res.json(toRewardResponse(reward));
  } catch (error) {
    logger.error(
      `getRewardByIdHandler: failed to fetch reward - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch reward'
    });
  }
};

/**
 * PATCH /rewards/:id - Update reward
 */
export const updateRewardHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateRewardInput;

    try {
      const reward = await updateReward(id, body);
      res.json(toRewardResponse(reward));
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Not Found',
          error: 'Reward not found'
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(
      `updateRewardHandler: failed to update reward - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to update reward'
    });
  }
};

/**
 * DELETE /rewards/:id - Delete reward
 */
export const deleteRewardHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      await deleteReward(id);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Not Found',
          error: 'Reward not found'
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(
      `deleteRewardHandler: failed to delete reward - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to delete reward'
    });
  }
};
