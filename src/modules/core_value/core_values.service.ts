/**
 * Core values service - database/API integration logic
 * Handles read operations for core values.
 */

import { prisma } from '../../config';
import type { CoreValue } from './core_values.types';

/**
 * Get all core values (no pagination).
 */
export const getCoreValues = async (): Promise<CoreValue[]> => {
  // Reason: core values are a small static lookup table, no need for pagination.
  return prisma.coreValue.findMany({
    orderBy: { created_at: 'asc' }
  });
};
