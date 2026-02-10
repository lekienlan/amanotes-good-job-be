/**
 * Kudo types - re-exports from Prisma schema and API DTOs derived from Prisma
 */

import type { CoreValue, Kudo, Reaction } from '../../../generated/prisma/client';
import type {
  KudoUncheckedCreateInput,
  KudoUncheckedUpdateInput
} from '../../../generated/prisma/models/Kudo';
import type { ReactionUncheckedCreateInput } from '../../../generated/prisma/models/Reaction';

export type { CoreValue, Kudo, Reaction };

/** API input for creating a kudo - derived from Prisma KudoUncheckedCreateInput */
export type CreateKudoInput = Pick<
  KudoUncheckedCreateInput,
  'receiver_id' | 'points' | 'description' | 'core_value_id'
>;

/** API input for updating a kudo - derived from Prisma KudoUncheckedUpdateInput */
export type UpdateKudoInput = Pick<
  KudoUncheckedUpdateInput,
  'points' | 'description' | 'core_value_id'
>;

/** API input for creating a reaction - derived from Prisma ReactionUncheckedCreateInput */
export type CreateReactionInput = Pick<ReactionUncheckedCreateInput, 'kudo_id' | 'emoji'>;

/** API response shape for a reaction (snake_case, dates as ISO string) - matches REST/WebSocket payload */
export interface ReactionResponsePayload {
  id?: string;
  kudo_id?: string;
  user_id?: string;
  emoji?: string;
  created_at?: string;
  updated_at?: string;
}

/** API response shape for a kudo with reactions (snake_case, dates as ISO string) - matches REST/WebSocket payload */
export interface KudoResponsePayload {
  id?: string;
  sender_id?: string;
  receiver_id?: string;
  points?: number;
  description?: string | null;
  core_value_id?: string | null;
  created_at?: string;
  updated_at?: string;
  reactions?: ReactionResponsePayload[];
}

/**
 * Realtime (WebSocket) event names and payload types for kudo feed.
 * Reuses API response types from Kudo module so REST and WebSocket share one contract.
 */

/** Event names emitted to kudo-feed room */
export const KUDO_EVENTS = {
  CREATED: 'kudo:created',
  UPDATED: 'kudo:updated',
  DELETED: 'kudo:deleted',
  REACTION_ADDED: 'kudo:reaction_added',
  REACTION_REMOVED: 'kudo:reaction_removed'
} as const;

export type KudoEventName = (typeof KUDO_EVENTS)[keyof typeof KUDO_EVENTS];

/** Room name clients join to receive kudo feed updates */
export const KUDO_FEED_ROOM = 'kudo-feed';
