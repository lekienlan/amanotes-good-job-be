import cors from 'cors';
import express from 'express';
import http from 'http';
import passportConfig from './config/passport';
import routes from './routes/v1';
import { initRealtime } from './config/socket_io';
import type { KudoRealtimeEmitter } from './modules/kudo/kudo.emitter';

const app = express();

// allow cross-origin requests
app.use(cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// configure passport
passportConfig();

// v1 api routes
app.use('/api/v1', routes);

const server = http.createServer(app);
const { io, kudoEmitter } = initRealtime(server);
(app as express.Express & { locals: { realtime?: KudoRealtimeEmitter } }).locals.realtime =
  kudoEmitter;

export { server, io };
