/**
 * Kudo controller - request/response handling
 * Separates HTTP layer from database logic
 */

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from '../../../generated/prisma/client';
import { logger } from '../../config';
import type { Kudo } from './kudo.types';
import {
  createKudo,
  getKudoById,
  getKudos,
  updateKudo,
  deleteKudo,
  addReaction,
  removeReaction
} from './kudo.service';
import { CreateKudoInput, UpdateKudoInput } from './kudo.types';
import { KudoRealtimeEmitter } from './kudo.emitter';

/**
 * Transform Prisma kudo to API response format (snake_case)
 */
const toKudoResponse = (kudo: any) => ({
  id: kudo.id,
  sender_id: kudo.sender_id,
  receiver_id: kudo.receiver_id,
  points: kudo.points,
  description: kudo.description,
  core_value_id: kudo.core_value_id,
  created_at: kudo.created_at,
  updated_at: kudo.updated_at,
  reactions: kudo.reactions?.map((r: any) => ({
    id: r.id,
    kudo_id: r.kudo_id,
    user_id: r.user_id,
    emoji: r.emoji,
    created_at: r.created_at,
    updated_at: r.updated_at
  }))
});

/** Get kudo realtime emitter from app.locals (set in index.ts). No-op if not set (e.g. tests). */
export function getKudoEmitter(req: Request): KudoRealtimeEmitter | undefined {
  return (req.app as any).locals?.realtime;
}

/**
 * POST /kudos - Create kudo
 */
export const createKudoHandler = async (req: Request, res: Response) => {
  try {
    // const user = req.user as User;
    const user = { id: 'acaa70fc-7a74-4ce5-96a3-d884da418a88' };
    const data = req.body as CreateKudoInput;

    logger.debug(
      `createKudoHandler: request received - userId=${user.id}, body=${JSON.stringify(data)}`
    );

    if (!data.receiver_id || data.points === undefined) {
      logger.warn('createKudoHandler: validation failed - receiver_id and points required');
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Bad Request',
        error: 'receiver_id and points are required'
      });
    }

    const kudo = await createKudo(user.id, data);
    logger.debug(
      `createKudoHandler: kudo created - kudoId=${kudo.id}, senderId=${user.id}, receiver_id=${data.receiver_id}`
    );
    const payload = toKudoResponse(kudo) as Kudo;
    res.status(httpStatus.CREATED).json(payload);
    getKudoEmitter(req)?.emitKudoCreated(payload);
  } catch (error) {
    logger.error(
      `createKudoHandler: failed to create kudo - ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to create kudo'
    });
  }
};

/**
 * GET /kudos - List kudos with pagination (query: page, limit, sort_by, direction, pick, populate, senderId, receiverId)
 */
export const getKudosHandler = async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id, page, limit, sort_by, direction, pick, populate } = req.query;

    const params = {
      ...(sender_id && { sender_id: sender_id as string }),
      ...(receiver_id && { receiver_id: receiver_id as string }),
      ...(page && { page: Number(page) }),
      ...(limit && { limit: Number(limit) }),
      ...(sort_by && { sort_by: sort_by as string }),
      ...(direction && { direction: direction as string }),
      ...(pick && { pick: pick as string }),
      ...(populate && { populate: populate as string })
    };

    const result = await getKudos(params);
    res.json({
      data: result.data.map(toKudoResponse),
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching kudos:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch kudos'
    });
  }
};

/**
 * GET /kudos/:id - Get kudo by ID
 */
export const getKudoByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kudo = await getKudoById(id);

    if (!kudo) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'Kudo not found'
      });
    }

    res.json(toKudoResponse(kudo));
  } catch (error) {
    console.error('Error fetching kudo:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to fetch kudo'
    });
  }
};

/**
 * PATCH /kudos/:id - Update kudo
 */
export const updateKudoHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateKudoInput;

    const existing = await getKudoById(id);
    if (!existing) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'Kudo not found'
      });
    }

    const user = req.user as User;
    if (existing.sender_id !== user.id) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: 'Forbidden',
        error: 'Only the sender can update this kudo'
      });
    }

    const kudo = await updateKudo(id, data);
    const payload = toKudoResponse(kudo) as Kudo;
    res.json(payload);
    getKudoEmitter(req)?.emitKudoUpdated(payload);
  } catch (error) {
    console.error('Error updating kudo:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to update kudo'
    });
  }
};

/**
 * DELETE /kudos/:id - Delete kudo
 */
export const deleteKudoHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await getKudoById(id);

    if (!existing) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'Kudo not found'
      });
    }

    const user = req.user as User;
    if (existing.sender_id !== user.id) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: 'Forbidden',
        error: 'Only the sender can delete this kudo'
      });
    }

    await deleteKudo(id);
    getKudoEmitter(req)?.emitKudoDeleted(existing);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting kudo:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to delete kudo'
    });
  }
};

/**
 * POST /kudos/:id/reactions - Add reaction to kudo
 */
export const addReactionHandler = async (req: Request, res: Response) => {
  try {
    const { id: kudoId } = req.params;
    const { emoji } = req.body;
    // const user = req.user as User;
    const user = { id: 'acaa70fc-7a74-4ce5-96a3-d884da418a88' };

    if (!emoji || typeof emoji !== 'string') {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Bad Request',
        error: 'emoji is required'
      });
    }

    const kudo = await getKudoById(kudoId);
    if (!kudo) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'Kudo not found'
      });
    }

    await addReaction(user.id, { kudo_id: kudoId, emoji });
    const updated = await getKudoById(kudoId);
    const payload = toKudoResponse(updated!) as Kudo;
    res.status(httpStatus.CREATED).json(payload);
    getKudoEmitter(req)?.emitReactionAdded(payload);
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to add reaction'
    });
  }
};

/**
 * DELETE /kudos/:id/reactions - Remove reaction from kudo
 */
export const removeReactionHandler = async (req: Request, res: Response) => {
  try {
    const { id: kudoId } = req.params;
    const { emoji } = req.query;
    const user = req.user as User;

    if (!emoji || typeof emoji !== 'string') {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Bad Request',
        error: 'emoji query param is required'
      });
    }

    const kudo = await getKudoById(kudoId);
    if (!kudo) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Not Found',
        error: 'Kudo not found'
      });
    }

    await removeReaction(kudoId, user.id, emoji);
    const updated = await getKudoById(kudoId);
    const payload = toKudoResponse(updated!) as Kudo;
    res.json(payload);
    getKudoEmitter(req)?.emitReactionRemoved(payload);
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      error: 'Failed to remove reaction'
    });
  }
};
