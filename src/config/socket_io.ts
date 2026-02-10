/**
 * WebSocket (Socket.io) server - kudo feed realtime updates.
 * Attaches to HTTP server, optional JWT auth, clients join kudo-feed room.
 */

import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import config from './config';
import logger from './logger';
import { verifyToken } from '../utils/jwt.util';
import { createKudoEmitter, KudoRealtimeEmitter } from '../modules/kudo/kudo.emitter';
import { KUDO_FEED_ROOM } from '../modules/kudo/kudo.types';

export interface RealtimeServerResult {
  io: SocketIOServer;
  kudoEmitter: KudoRealtimeEmitter;
}

/**
 * Initialize Socket.io on the HTTP server with JWT auth and kudo-feed room.
 * Returns io and kudoEmitter; attach kudoEmitter to app.locals.realtime for controller use.
 */
export function initRealtime(server: http.Server): RealtimeServerResult {
  const io = new SocketIOServer(server, {
    cors: {
      origin: config.frontend?.url || true,
      methods: ['GET', 'POST']
    },
    path: '/socket.io'
  });

  io.use((socket: Socket, next: (err?: Error) => void) => {
    const token =
      (socket.handshake.auth?.token as string) || (socket.handshake.query?.token as string);
    if (!token) {
      logger.debug('Realtime: connection without token, allowing (optional auth)');
      return next();
    }
    try {
      const payload = verifyToken(token);
      (socket as any).userId = payload.userId;
    } catch (err) {
      logger.warn('Realtime: invalid token on connection');
      return next(new Error('Invalid token'));
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    socket.join(KUDO_FEED_ROOM);
    logger.debug(`Realtime: client connected, joined ${KUDO_FEED_ROOM}`);

    socket.on('disconnect', () => {
      logger.debug('Realtime: client disconnected');
    });
  });

  const kudoEmitter = createKudoEmitter(io);
  return { io, kudoEmitter };
}
