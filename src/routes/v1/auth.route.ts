import express from 'express';
import { authenticate } from '../../modules/auth/auth.middleware';
import { getMe, login } from '../../modules/auth/auth.controller';

const router = express.Router();

/**
 * @route   GET /auth/me
 * @desc    Get current authenticated user
 * @access  Private (requires JWT)
 */
router.get('/me', authenticate(), getMe);

/**
 * @route   POST /auth/login
 * @desc    Simple username/password login
 * @access  Public
 */
router.post('/login', login);

export default router;
