import type { PgTable, TableConfig } from 'drizzle-orm/pg-core';
import { db } from '~/lib/server/db';

export async function seedTasks<T extends object>(
  randomObjGenerator: () => T,
  tableName: PgTable<TableConfig>,
  count: number = 100,
) {
  if (count < 1) {
    count = 100;
  }

  try {
    const allTasks: T[] = [];

    for (let i = 0; i < count; i++) {
      allTasks.push(randomObjGenerator());
    }

    console.log('📝 Inserting tasks', allTasks.length);

    await db.insert(tableName).values(allTasks).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }
}
