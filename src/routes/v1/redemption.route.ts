/**
 * Redemption routes - CRUD API for redemptions
 */

import express from 'express';
import {
  createRedemptionHandler,
  getRedemptionsHandler,
  getRedemptionByIdHandler,
  updateRedemptionHandler,
  deleteRedemptionHandler
} from '../../modules/redemption/redemption.controller';

const router = express.Router();

/**
 * @route   POST /redemptions
 * @desc    Create a new redemption
 * @access  Public (consider protecting with auth later)
 */
router.post('/', createRedemptionHandler);

/**
 * @route   GET /redemptions
 * @desc    List redemptions (with pagination)
 * @access  Public
 */
router.get('/', getRedemptionsHandler);

/**
 * @route   GET /redemptions/:id
 * @desc    Get redemption by ID
 * @access  Public
 */
router.get('/:id', getRedemptionByIdHandler);

/**
 * @route   PATCH /redemptions/:id
 * @desc    Update redemption
 * @access  Public (consider protecting with auth later)
 */
router.patch('/:id', updateRedemptionHandler);

/**
 * @route   DELETE /redemptions/:id
 * @desc    Delete redemption
 * @access  Public (consider protecting with auth later)
 */
router.delete('/:id', deleteRedemptionHandler);

export default router;
