import express from 'express';
import passport from 'passport';
import { googleCallback, authFailure } from '../../modules/auth/auth.controller';

const router = express.Router();

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
    failureRedirect: '/auth/failure'
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
