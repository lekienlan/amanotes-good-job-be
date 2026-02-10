import type { Redemption as RedemptionModel } from '../../../generated/prisma/client';
import type {
  RedemptionUncheckedCreateInput,
  RedemptionUncheckedUpdateInput
} from '../../../generated/prisma/models/Redemption';

/** Prisma Redemption model re-export for module usage */
export type Redemption = RedemptionModel;

/** API input for creating a redemption - derived from Prisma RedemptionUncheckedCreateInput */
export type CreateRedemptionInput = Pick<
  RedemptionUncheckedCreateInput,
  'user_id' | 'reward_id' | 'points_spent' | 'status'
>;

/** API input for updating a redemption - derived from Prisma RedemptionUncheckedUpdateInput */
export type UpdateRedemptionInput = Pick<RedemptionUncheckedUpdateInput, 'points_spent' | 'status'>;
