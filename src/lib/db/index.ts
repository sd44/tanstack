import { createServerOnlyFn } from '@tanstack/react-start';
import { SQL } from 'bun';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/bun-sql';
import type { Logger } from 'drizzle-orm/logger';
import { env } from '~/env/server';
import { logger } from '~/lib/pino-logger';
import * as schema from './schema';

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    const cleanedQuery = query.replace(/"/g, '');
    logger.info({ drizzleDB: cleanedQuery, params });
  }
}

const driver = new SQL(env.DATABASE_URL);

const getDatabase = createServerOnlyFn(() =>
  drizzle({ client: driver, schema, casing: 'snake_case', logger: new MyLogger() }),
);
export const db = getDatabase();
