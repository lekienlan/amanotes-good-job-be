import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from './config';
import { findUserById } from '../modules/auth/auth.service';
import { JWTPayload } from '../modules/auth/auth.types';

/**
 * Configure JWT Strategy for protecting routes.
 * Google login has been removed; we only support JWT-based auth.
 */
export const configureJWTStrategy = () => {
  const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: JWTPayload, done) => {
      try {
        // Find user by ID from JWT payload
        const user = await findUserById(payload.userId);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

/**
 * Configure all Passport strategies.
 * Call this function once during app initialization.
 */
export const configurePassport = () => {
  configureJWTStrategy();
};

export default configurePassport;
