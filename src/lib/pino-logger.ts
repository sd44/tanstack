// This file is isomorphic and uses TanStack's `serverOnly` for added safety.
import { serverOnly } from '@tanstack/react-start';
import pino from 'pino';

// 1. Define a mock logger for the client-side. It's completely safe for browsers.
const createMockLogger = (): pino.Logger => {
  const noOp = () => {
    /* noop */
  };
  const handler = {
    get: () => noOp,
  };
  return new Proxy({}, handler) as pino.Logger;
};

// 2. Define the function that creates the REAL logger and protect it with `serverOnly`.
// This function will now throw an error if ever called on the client.
const createRealLogger = serverOnly(() => {
  const targets: pino.TransportTargetOptions[] = [];

  // File transport for the server
  targets.push({
    target: 'pino/file',
    level: 'info',
    options: {
      destination: 'logs/app.log',
      mkdir: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    },
  });

  // Pretty-printing transport for development server console
  if (process.env.NODE_ENV !== 'production') {
    targets.push({
      target: 'pino-pretty',
      level: 'debug',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    });
  }

  // Initialize and return the real pino logger
  return pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      targets,
    },
  });
});

// 3. At runtime, check the environment and export the correct logger.
let logger: pino.Logger;

if (typeof window === 'undefined') {
  // We are on the server, so it's safe to call our server-only function.
  logger = createRealLogger();
} else {
  // We are on the client, so we create the mock logger.
  logger = createMockLogger();
}

export { logger };
