/**
 * Redemption controller - request/response handling
 * Separates HTTP layer from database logic
 */

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../../config';
import {
  createRedemption,
  getRedemptions,
  getRedemptionById,
  updateRedemption,
  deleteRedemption
} from './redemption.service';
import type { PaginationParam } from '../pagination';
import type { CreateRedemptionInput, UpdateRedemptionInput } from './redemption.types';

/**
 * Transform Prisma redemption to API response format (snake_case)
 */
const toRedemptionResponse = (redemption: any) => ({
  id: redemption.id,
  user_id: redemption.user_id,
  reward_id: redemption.reward_id,
  points_spent: redemption.points_spent,
  status: redemption.status,
  created_at: redemption.created_at,
  updated_at: redemption.updated_at,
  user: redemption.user
    ? {
        id: redemption.user.id,
        email: redemption.user.email,
        first_name: redemption.user.first_name,
        last_name: redemption.user.last_name
      }
    : undefined,
  reward: redemption.reward
    ? {
        id: redemption.reward.id,
        name: redemption.reward.name,
        points_cost: redemption.reward.points_cost
      }
    : undefined
});

/**
 * POST /redemptions - Create redemption
 */
export const createRedemptionHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateRedemptionInput;

    if (!body.user_id || !body.reward_id || body.points_spent === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Bad Request',
        error: 'user_id, reward_id and points_spent are required'
      });
    }

    const redemption = await createRedemption(body);
    res.status(httpStatus.CREATED).json(toRedemptionResponse(redemption));
  } catch (error) {
    logger.error(
      `createRedemptionHandler: failed to create redemption - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to create redemption'
    });
  }
};

/**
 * GET /redemptions - List redemptions with pagination
 */
export const getRedemptionsHandler = async (req: Request, res: Response) => {
  try {
    const { page, limit, sort_by, direction, pick, populate, user_id, reward_id, status } =
      req.query;

    const params: PaginationParam & {
      user_id?: string;
      reward_id?: string;
      status?: string;
    } = {
      ...(page && { page: Number(page) }),
      ...(limit && { limit: Number(limit) }),
      ...(sort_by && { sort_by: sort_by as string }),
      ...(direction && { direction: direction as string }),
      ...(pick && { pick: pick as string }),
      ...(populate && { populate: populate as string }),
      ...(user_id && { user_id: user_id as string }),
      ...(reward_id && { reward_id: reward_id as string }),
      ...(status && { status: status as string })
    };

    const result = await getRedemptions(params);
    res.json({
      data: result.data.map(toRedemptionResponse),
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(
      `getRedemptionsHandler: failed to fetch redemptions - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch redemptions'
    });
  }
};

/**
 * GET /redemptions/:id - Get redemption by ID
 */
export const getRedemptionByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const redemption = await getRedemptionById(id);

    if (!redemption) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'Redemption not found'
      });
    }

    res.json(toRedemptionResponse(redemption));
  } catch (error) {
    logger.error(
      `getRedemptionByIdHandler: failed to fetch redemption - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch redemption'
    });
  }
};

/**
 * PATCH /redemptions/:id - Update redemption
 */
export const updateRedemptionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateRedemptionInput;

    try {
      const redemption = await updateRedemption(id, body);
      res.json(toRedemptionResponse(redemption));
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Not Found',
          error: 'Redemption not found'
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(
      `updateRedemptionHandler: failed to update redemption - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to update redemption'
    });
  }
};

/**
 * DELETE /redemptions/:id - Delete redemption
 */
export const deleteRedemptionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      await deleteRedemption(id);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error: any) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Not Found',
          error: 'Redemption not found'
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(
      `deleteRedemptionHandler: failed to delete redemption - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to delete redemption'
    });
  }
};
