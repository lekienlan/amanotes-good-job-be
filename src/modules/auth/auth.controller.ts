import { Request, Response } from 'express';
import { User } from '../../../generated/prisma/client';
import { generateTokens } from '../../utils/jwt.util';

/**
 * Google OAuth callback handler
 * Called after successful Google authentication
 */
export const googleCallback = (req: Request, res: Response) => {
  try {
    // User is attached to req.user by Passport
    const user = req.user as User;
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: 'authentication_failed' });
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Return tokens as JSON response
    res.json({
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error in googleCallback:', error);
    res.status(500).json({ error: 'server_error' });
  }
};

/**
 * Handle authentication failure
 */
export const authFailure = (req: Request, res: Response) => {
  res.status(401).json({ error: 'authentication_failed' });
};
