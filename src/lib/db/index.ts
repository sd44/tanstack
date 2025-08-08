'use server';

// import { drizzle } from 'drizzle-orm/node-postgres';
// import { drizzle } from 'drizzle-orm/postgres-js';

import { drizzle } from 'drizzle-orm/bun-sql';
import type { Logger } from 'drizzle-orm/logger';
import { logger as pinoLogger } from '../pino-logger';
import * as schema from './schema';

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    const cleanedQuery = query.replace(/"/g, '');
    pinoLogger.info({ drizzleQuery: cleanedQuery, params });
  }
}

// biome-ignore lint/style/noNonNullAssertion: .env file
export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: new MyLogger(),
});
