/**
 * User types - API DTOs for user update (PATCH)
 */

import type { UserUpdateInput } from '../../../generated/prisma/models/User';

/** Allowed fields for PATCH /users/:id (partial update) */
export type UpdateUserInput = Partial<
  Pick<
    UserUpdateInput,
    | 'giving_budget'
    | 'first_name'
    | 'last_name'
    | 'avatar'
    | 'department'
    | 'role'
    | 'points_balance'
    | 'last_budget_reset'
  >
>;
