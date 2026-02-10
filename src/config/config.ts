import dotenv from 'dotenv';
import path from 'path';

// Determine which .env file to load based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'development' ? '.env' : `.env.${env}`;
const envPath = path.resolve(process.cwd(), envFile);

// Load environment variables from the appropriate .env file
dotenv.config({ path: envPath });

export default {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES || '14400'), // 10 days
    refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS || '30'),
    resetPasswordExpirationMinutes: parseInt(
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || '10'
    ),
    verifyEmailExpirationMinutes: parseInt(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || '10')
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    enabled: process.env.REDIS_ENABLED !== 'false'
  }
};
