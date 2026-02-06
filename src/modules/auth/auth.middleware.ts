import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User, Role } from '../../../generated/prisma/client';
import httpStatus from 'http-status';

/**
 * Middleware to authenticate requests using JWT
 * Attaches user to req.user if authentication succeeds
 */
export const authenticate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error, user: User, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: 'Unauthorized',
          error: info?.message || 'Invalid or missing authentication token'
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

/**
 * Middleware to check if authenticated user has required role(s)
 * Must be used after authenticate() middleware
 * @param roles - Array of allowed roles
 */
export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

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
