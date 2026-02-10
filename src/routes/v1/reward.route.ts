/**
 * Reward routes - CRUD API for rewards
 */

import express from 'express';
import {
  createRewardHandler,
  getRewardsHandler,
  getRewardByIdHandler,
  updateRewardHandler,
  deleteRewardHandler
} from '../../modules/reward/reward.controller';

const router = express.Router();

/**
 * @route   POST /rewards
 * @desc    Create a new reward
 * @access  Public (consider protecting with auth later)
 */
router.post('/', createRewardHandler);

/**
 * @route   GET /rewards
 * @desc    List rewards (with pagination)
 * @access  Public
 */
router.get('/', getRewardsHandler);

/**
 * @route   GET /rewards/:id
 * @desc    Get reward by ID
 * @access  Public
 */
router.get('/:id', getRewardByIdHandler);

/**
 * @route   PATCH /rewards/:id
 * @desc    Update reward
 * @access  Public (consider protecting with auth later)
 */
router.patch('/:id', updateRewardHandler);

/**
 * @route   DELETE /rewards/:id
 * @desc    Delete reward
 * @access  Public (consider protecting with auth later)
 */
router.delete('/:id', deleteRewardHandler);

export default router;
