import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from './config';
import { findOrCreateUser, findUserById } from '../modules/auth/auth.service';
import { JWTPayload } from '../modules/auth/auth.types';

/**
 * Configure Google OAuth Strategy
 */
export const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
        scope: ['profile', 'email']
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
          // Extract user info from Google profile
          const email = profile.emails?.[0]?.value;
          const firstName = profile.name?.givenName;
          const lastName = profile.name?.familyName;
          const picture = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          // Find or create user
          const user = await findOrCreateUser({
            id: profile.id,
            email,
            firstName,
            lastName,
            picture
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};

/**
 * Configure JWT Strategy for protecting routes
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
 * Configure all Passport strategies
 * Call this function once during app initialization
 */
export const configurePassport = () => {
  configureGoogleStrategy();
  configureJWTStrategy();
};

export default configurePassport;
