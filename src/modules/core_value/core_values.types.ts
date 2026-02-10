import type { CoreValue as CoreValueModel } from '../../../generated/prisma/client';

/** Prisma CoreValue model re-export for module usage */
export type CoreValue = CoreValueModel;

/**
 * Predefined core values to seed into the database.
 * Reason: centralized constant reused by seed script and potential tests.
 */
export const PREDEFINED_CORE_VALUES: Pick<CoreValue, 'name' | 'emoji' | 'description'>[] = [
  { name: 'Teamwork', emoji: '🤝', description: 'Collaboration and team spirit' },
  { name: 'Ownership', emoji: '🎯', description: 'Taking responsibility and initiative' },
  { name: 'Innovation', emoji: '💡', description: 'Creative thinking and problem solving' },
  { name: 'Excellence', emoji: '⭐', description: 'Commitment to quality and high standards' },
  { name: 'Integrity', emoji: '🛡️', description: 'Honesty, ethics, and transparency' }
];
