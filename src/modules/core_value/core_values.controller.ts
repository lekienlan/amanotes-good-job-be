/**
 * Core values controller - request/response handling
 * Separates HTTP layer from database logic.
 */

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../../config';
import { getCoreValues } from './core_values.service';

/**
 * Transform Prisma core value to API response format (snake_case)
 */
const toCoreValueResponse = (coreValue: any) => ({
  id: coreValue.id,
  name: coreValue.name,
  emoji: coreValue.emoji,
  description: coreValue.description,
  created_at: coreValue.created_at,
  updated_at: coreValue.updated_at
});

/**
 * GET /core-values - List all core values (no pagination)
 */
export const getCoreValuesHandler = async (req: Request, res: Response) => {
  try {
    const coreValues = await getCoreValues();
    res.json(coreValues.map(toCoreValueResponse));
  } catch (error) {
    logger.error(
      `getCoreValuesHandler: failed to fetch core values - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch core values'
    });
  }
};
