/**
 * User routes - list and get user APIs
 */

import express from 'express';
import {
  getUsersHandler,
  getUserByIdHandler,
  patchUserByIdHandler
} from '../../modules/user/user.controller';

const router = express.Router();

/**
 * @route   GET /users
 * @desc    List all users with pagination (all roles)
 * @access  Public
 */
router.get('/', getUsersHandler);

/**
 * @route   GET /users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', getUserByIdHandler);

/**
 * @route   PATCH /users/:id
 * @desc    Update user by ID (e.g. giving_budget, first_name, last_name)
 * @access  Public
 */
router.patch('/:id', patchUserByIdHandler);

export default router;
