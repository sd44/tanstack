/**
 * @see https://gist.github.com/rphlmr/0d1722a794ed5a16da0fdf6652902b15
 */

import { type AnyColumn, type Table, InferInsertModel, not, sql } from 'drizzle-orm';
import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { db } from '../server/db';

interface Result {
  success: boolean;
  error?: string;
  data?: any;
}

export function takeFirstOrNull<TData>(data: TData[]) {
  return data[0] ?? null;
}

export function takeFirstOrThrow<TData>(data: TData[]) {
  const first = takeFirstOrNull(data);

  if (!first) {
    throw new Error('Item not found');
  }

  return first;
}

export function isEmpty<TColumn extends AnyColumn>(column: TColumn) {
  return sql<boolean>`
    case
      when ${column} is null then true
      when ${column} = '' then true
      when ${column}::text = '[]' then true
      when ${column}::text = '{}' then true
      else false
    end
  `;
}

export function isNotEmpty<TColumn extends AnyColumn>(column: TColumn) {
  return not(isEmpty(column));
}

// 定义一个泛型表生成函数
export function createTable<T extends { id: number }>(
  tableName: string,
  columns: (name: string) => { [K in keyof Omit<T, 'id'>]: T },
) {
  const table = pgTable(tableName, {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
    ...columns(tableName),
  });

  return table;
}

export async function insert<TTable extends Table>(
  table: TTable,
  data: InferInsertModel<TTable>,
): Promise<Result> {
  try {
    const result = await db.insert(table).values(data).returning();
    if (result.length === 0) {
      return { success: false, error: '提交数据失败' };
    }
    // 插入成功，返回成功状态和插入的数据
    return { success: true, data: result[0] };
  } catch (error: any) {
    // 捕获插入过程中发生的任何错误
    console.error('插入数据失败：', error.detail);

    // 返回通用的错误信息
    return { success: false, error: '提交数据失败: ' + error.detail };
  }
}

// // 定义一个泛型类型，表示必然包含 id number 列的 Drizzle Table
// // BUG: 类型有误，修改 CRUD 函数的类型定义
// export type BaseTable<T extends Table> = T & {
//   id: AnyColumn;
// };

// export async function read<TTable extends Table>(table: BaseTable<TTable>, id: AnyColumn) {
//   const result = await db.select().from(table).where(eq(table.id, id)).limit(1);
//   return result[0];
// }

// export async function update<TTable extends BaseTable>(
//   table: TTable,
//   id: AnyColumn,
//   data: Partial<InferInsertModel<TTable>>,
// ): Promise<InferSelectModel<TTable> | undefined> {
//   const result = await db.update(table).set(data).where(eq(table.id, id)).returning();
//   return result[0];
// }

// export async function deleteRecord<TTable extends BaseTable>(
//   table: TTable,
//   id: AnyColumn,
// ): Promise<void> {
//   await db.delete(table).where(eq(table.id, id));
// }

// export async function query_id<TTable extends PgTable>(table: TTable, id: AnyColumn) {
//   return db.select().from(table).where(eq(table.id, id));
// }
