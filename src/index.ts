import { server, io } from './app';
import config from './config/config';

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

function shutdown() {
  io.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
