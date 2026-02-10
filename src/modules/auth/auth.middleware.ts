import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { User, Role } from '../../../generated/prisma/client';

/**
 * Wrapper around Passport's JWT authentication.
 * Ensures req.user is populated with the authenticated user.
 */
export const authenticate = () => passport.authenticate('jwt', { session: false });

/**
 * Middleware to check if authenticated user has required role(s).
 * Must be used after authenticate() middleware.
 * @param roles - Array of allowed roles
 */
export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User | undefined;

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized',
        error: 'Authentication required'
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: 'Forbidden',
        error: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};
