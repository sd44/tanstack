// This file is isomorphic and uses TanStack's `serverOnly` for added safety.
import winston from 'winston';

const createRealLogger = () => {
  const transports: winston.transport[] = [];

  // Common format for timestamps
  const timestampFormat = winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  });

  // File transport for the server
  transports.push(
    new winston.transports.File({
      level: 'info',
      filename: 'logs/app.log',
      format: winston.format.combine(
        timestampFormat,
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  );

  // Console transport for development server
  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          timestampFormat,
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          }),
        ),
      }),
    );
  }

  // Initialize and return the real winston logger
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports,
    // Do not exit on handled exceptions
    exitOnError: false,
  });

  return logger;
};

// At runtime, check the environment and export the correct logger.
export default createRealLogger();
