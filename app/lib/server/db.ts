import { type Logger } from 'drizzle-orm/logger';
// import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.debug('___QUERY___');
    console.debug(query);
    console.debug(params);
    console.debug('___END_QUERY___');
  }
}

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: new QueryLogger(),
});
