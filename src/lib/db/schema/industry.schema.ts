import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const norm_industry = pgTable('norm_industry', {
  code: varchar({ length: 8 }).primaryKey(),
  name: varchar({ length: 64 }).notNull(),
  parent_code: varchar({ length: 8 }),
  level: integer('level'),
});
