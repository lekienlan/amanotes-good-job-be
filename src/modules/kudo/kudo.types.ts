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
