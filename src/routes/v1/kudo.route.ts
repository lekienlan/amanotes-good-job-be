/**
 * Kudo routes - CRUD API for kudos
 * All routes require authentication
 */

import express from 'express';
import { authenticate } from '../../modules/auth/auth.middleware';
import {
  createKudoHandler,
  getKudosHandler,
  getKudoByIdHandler,
  updateKudoHandler,
  deleteKudoHandler,
  addReactionHandler,
  removeReactionHandler
} from '../../modules/kudo/kudo.controller';

const router = express.Router();

// All kudo routes require authentication
// router.use(authenticate());

/**
 * @route   POST /kudos
 * @desc    Create a new kudo
 * @access  Private
 */
router.post('/', createKudoHandler);

/**
 * @route   GET /kudos
 * @desc    List kudos (optional query: senderId, receiverId)
 * @access  Private
 */
router.get('/', getKudosHandler);

/**
 * @route   POST /kudos/:id/reactions
 * @desc    Add reaction to kudo (body: { emoji })
 * @access  Private
 */
router.post('/:id/reactions', addReactionHandler);

/**
 * @route   DELETE /kudos/:id/reactions?emoji=:emoji
 * @desc    Remove reaction from kudo
 * @access  Private
 */
router.delete('/:id/reactions', removeReactionHandler);

/**
 * @route   GET /kudos/:id
 * @desc    Get kudo by ID
 * @access  Private
 */
router.get('/:id', getKudoByIdHandler);

/**
 * @route   PATCH /kudos/:id
 * @desc    Update kudo (sender only)
 * @access  Private
 */
router.patch('/:id', updateKudoHandler);

/**
 * @route   DELETE /kudos/:id
 * @desc    Delete kudo (sender only)
 * @access  Private
 */
router.delete('/:id', deleteKudoHandler);

export default router;
