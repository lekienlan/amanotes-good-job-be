/**
 * Kudo feed realtime emitter - broadcasts to kudo-feed room.
 * Used by kudo controller after mutations; no Socket.io dependency in service layer.
 */

import { Server as SocketIOServer } from 'socket.io';
import { KUDO_EVENTS, KUDO_FEED_ROOM } from './kudo.types';
import { Kudo } from '.';

export interface KudoRealtimeEmitter {
  emitKudoCreated: (kudo: Kudo) => void;
  emitKudoUpdated: (kudo: Kudo) => void;
  emitKudoDeleted: (payload: Kudo) => void;
  emitReactionAdded: (kudo: Kudo) => void;
  emitReactionRemoved: (kudo: Kudo) => void;
}

/**
 * Create emitter that broadcasts kudo events to the kudo-feed room.
 * No-op if io is not provided (e.g. tests or realtime disabled).
 */
export function createKudoEmitter(io: SocketIOServer | null): KudoRealtimeEmitter {
  const emit = (event: string, payload: unknown) => {
    if (io) {
      io.to(KUDO_FEED_ROOM).emit(event, payload);
    }
  };

  return {
    emitKudoCreated: (kudo: Kudo) => emit(KUDO_EVENTS.CREATED, kudo),
    emitKudoUpdated: (kudo: Kudo) => emit(KUDO_EVENTS.UPDATED, kudo),
    emitKudoDeleted: (payload: Kudo) => emit(KUDO_EVENTS.DELETED, payload),
    emitReactionAdded: (kudo: Kudo) => emit(KUDO_EVENTS.REACTION_ADDED, kudo),
    emitReactionRemoved: (kudo: Kudo) => emit(KUDO_EVENTS.REACTION_REMOVED, kudo)
  };
}
