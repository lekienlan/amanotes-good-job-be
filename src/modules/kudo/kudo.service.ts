/**
 * Kudo service - database/API integration logic
 * Handles all CRUD operations for kudos and reactions
 */

import { prisma } from '../../config';
import { pagination } from '../pagination';
import { PaginationParam } from '../pagination/pagination.types';
import { CreateKudoInput, UpdateKudoInput, CreateReactionInput } from './kudo.types';

/**
 * Create a new kudo
 */
export const createKudo = async (senderId: string, data: CreateKudoInput) => {
  // Reason: when creating a kudo we must also
  // - decrease sender.giving_budget by points
  // - increase receiver.points_balance by points
  // Do everything in a single transaction to keep data consistent.
  const { receiver_id, points, description, core_value_id } = data;

  return await prisma.$transaction(async (tx) => {
    const kudo = await tx.kudo.create({
      data: {
        sender_id: senderId,
        receiver_id,
        points,
        description: description ?? null,
        core_value_id: core_value_id ?? null
      },
      include: { reactions: true }
    });

    // Update sender giving budget (points they can give)
    await tx.user.update({
      where: { id: senderId },
      data: {
        giving_budget: {
          decrement: points
        }
      }
    });

    // Update receiver points balance (points they have received)
    await tx.user.update({
      where: { id: receiver_id },
      data: {
        points_balance: {
          increment: points
        }
      }
    });

    return kudo;
  });
};

/**
 * Get kudo by ID
 */
export const getKudoById = async (id: string) => {
  return await prisma.kudo.findUnique({
    where: { id },
    include: { reactions: true }
  });
};

/**
 * Get paginated kudos with optional filters
 */
export const getKudos = async (
  params: PaginationParam & { sender_id?: string; receiver_id?: string }
) => {
  const { sender_id, receiver_id, ...paginationParams } = params;
  const where = {
    ...(sender_id && { sender_id: sender_id }),
    ...(receiver_id && { receiver_id: receiver_id })
  };

  return await pagination(prisma.kudo, {
    ...paginationParams,
    where: Object.keys(where).length > 0 ? where : undefined,
    sort_by: params.sort_by ?? 'created_at',
    direction: params.direction ?? 'desc',
    populate: params.populate ?? 'reactions'
  });
};

/**
 * Update kudo by ID
 */
export const updateKudo = async (id: string, data: UpdateKudoInput) => {
  return await prisma.kudo.update({
    where: { id },
    data: {
      ...(data.points !== undefined && { points: data.points }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.core_value_id !== undefined && {
        core_value_id: data.core_value_id || null
      })
    },
    include: { reactions: true }
  });
};

/**
 * Delete kudo by ID
 */
export const deleteKudo = async (id: string) => {
  return await prisma.kudo.delete({
    where: { id }
  });
};

/**
 * Add reaction to kudo
 */
export const addReaction = async (userId: string, data: CreateReactionInput) => {
  return await prisma.reaction.create({
    data: {
      kudo_id: data.kudo_id,
      user_id: userId,
      emoji: data.emoji
    }
  });
};

/**
 * Remove reaction from kudo
 */
export const removeReaction = async (kudoId: string, userId: string, emoji: string) => {
  return await prisma.reaction.deleteMany({
    where: {
      kudo_id: kudoId,
      user_id: userId,
      emoji
    }
  });
};
