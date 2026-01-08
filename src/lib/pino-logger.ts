import { createServerOnlyFn } from '@tanstack/react-start';
import pino from 'pino';

const createRealLogger = createServerOnlyFn(() => {
  const targets: pino.TransportTargetOptions[] = [];

  // File transport for the server
  targets.push({
    target: 'pino/file',
    level: 'info',
    options: {
      destination: 'logs/app.log',
      mkdir: true,
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
      },
    });
  }

  // Initialize and return the real pino logger
  return pino({
    base: null,
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      targets,
    },
  });
});

export const logger = createRealLogger();
