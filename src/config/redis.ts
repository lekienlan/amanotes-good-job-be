/**
 * Redis client for caching, token exchange, rate limiting, etc.
 * When redis.enabled is false, client is null and the app can run without Redis.
 */

import Redis from 'ioredis';
import config from './config';
import logger from './logger';

const AUTH_CODE_TTL_SECONDS = 300;

let redis: Redis | null = null;

if (config.redis.enabled && config.redis.url) {
  redis = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    }
  });

  redis.on('connect', () => {
    logger.info('Redis connected');
  });

  redis.on('error', (err) => {
    logger.error('Redis error: %s', err.message);
  });
}

export { redis, AUTH_CODE_TTL_SECONDS };

/**
 * Graceful shutdown: close Redis connection.
 * Call from process SIGTERM/SIGINT handler.
 */
export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    logger.info('Redis disconnected');
  }
}
