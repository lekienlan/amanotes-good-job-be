import express from 'express';
import passport from 'passport';
import config from '../../config/config';
import { authenticate } from '../../modules/auth/auth.middleware';
import {
  googleCallback,
  authFailure,
  getMe,
  exchangeTokenByCode
} from '../../modules/auth/auth.controller';

const router = express.Router();

/**
 * @route   GET /auth/me
 * @desc    Get current authenticated user
 * @access  Private (requires JWT)
 */
router.get('/me', authenticate(), getMe);

/**
 * @route   POST /auth/token
 * @desc    Exchange one-time code for access and refresh tokens
 * @access  Public
 */
router.post('/token', exchangeTokenByCode);

/**
 * @route   GET /auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${config.frontend.url}/login?error=authentication_failed`
  }),
  googleCallback
);

/**
 * @route   GET /auth/failure
 * @desc    Authentication failure handler
 * @access  Public
 */
router.get('/failure', authFailure);

export default router;
