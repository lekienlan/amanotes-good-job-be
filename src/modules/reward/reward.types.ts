import type { Reward as RewardModel } from '../../../generated/prisma/client';
import type {
  RewardUncheckedCreateInput,
  RewardUncheckedUpdateInput
} from '../../../generated/prisma/models/Reward';

/** Prisma Reward model re-export for module usage */
export type Reward = RewardModel;

/** API input for creating a reward - derived from Prisma RewardUncheckedCreateInput */
export type CreateRewardInput = Pick<
  RewardUncheckedCreateInput,
  'name' | 'description' | 'points_cost' | 'image_url' | 'stock' | 'is_active'
>;

/** API input for updating a reward - derived from Prisma RewardUncheckedUpdateInput */
export type UpdateRewardInput = Pick<
  RewardUncheckedUpdateInput,
  'name' | 'description' | 'points_cost' | 'image_url' | 'stock' | 'is_active'
>;

/**
 * Predefined rewards to seed into the database.
 * Reason: centralize default rewards for consistent initial data.
 */
export const PREDEFINED_REWARDS: Pick<
  Reward,
  'name' | 'description' | 'points_cost' | 'image_url' | 'stock' | 'is_active'
>[] = [
  {
    name: 'Company Hoodie',
    description: 'Premium quality company branded hoodie',
    points_cost: 50,
    image_url: 'https://via.placeholder.com/300x300?text=Hoodie',
    stock: 25,
    is_active: true
  },
  {
    name: 'Friday Afternoon Off',
    description: 'Leave early on a Friday of your choice',
    points_cost: 200,
    image_url: 'https://via.placeholder.com/300x300?text=Time+Off',
    stock: 100,
    is_active: true
  },
  {
    name: 'Premium Parking Spot',
    description: 'Reserved parking for one month',
    points_cost: 100,
    image_url: 'https://via.placeholder.com/300x300?text=Parking',
    stock: 5,
    is_active: true
  },
  {
    name: 'Wireless Headphones',
    description: 'High-quality noise-canceling headphones',
    points_cost: 1200,
    image_url: 'https://via.placeholder.com/300x300?text=Headphones',
    stock: 10,
    is_active: true
  },
  {
    name: 'Team Lunch',
    description: 'Catered lunch for your entire team',
    points_cost: 800,
    image_url: 'https://via.placeholder.com/300x300?text=Team+Lunch',
    stock: 20,
    is_active: true
  },
  {
    name: 'Gift Card $50',
    description: 'Amazon or similar retailer gift card',
    points_cost: 20,
    image_url: 'https://via.placeholder.com/300x300?text=Gift+Card',
    stock: 50,
    is_active: true
  }
];
