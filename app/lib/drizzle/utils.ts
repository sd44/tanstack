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

export function isEmpty(column: AnyColumn) {
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

export function isNotEmpty(column: AnyColumn) {
  return not(isEmpty(column));
}
const baseMeta = {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
};
// 定义一个泛型表生成函数
export function createTable<T extends { id: number }>(
  tableName: string,
  columns: (name: string) => { [K in keyof Omit<T, 'id'>]: T },
) {
  const table = pgTable(tableName, {
    ...baseMeta,
    ...columns(tableName),
  });

  return table;
}

export async function insert<TTable extends Table>(
  table: TTable,
  data: InferInsertModel<TTable> | InferInsertModel<TTable>[],
): Promise<Result> {
  try {
    const values = Array.isArray(data) ? data : [data];
    const result = await db.insert(table).values(values).returning();
    if (result.length === 0) {
      return { success: false, error: '提交数据失败' };
    }
    // 插入成功，返回成功状态和插入的数据
    // 如果是数组输入则返回全部结果，否则返回第一个结果
    return {
      success: true,
      data: Array.isArray(data) ? result : result[0],
    };
  } catch (error: unknown) {
    let detailMessage = '未知错误'; // Default error message

    // Type Guard: Check if error is an object and has a 'detail' property
    if (error && typeof error === 'object' && 'detail' in error) {
      // Safely access detail, convert to string just in case it's not already
      detailMessage = String((error as { detail: unknown }).detail);
    } else if (error instanceof Error) {
      // Fallback to standard Error message if detail is not available
      detailMessage = error.message;
    } else {
      // Final fallback: Convert the unknown error to string
      detailMessage = String(error);
    }

    console.error('插入数据失败:', detailMessage, error); // Log the extracted message and the original error object for full context

    return { success: false, error: '提交数据失败: ' + detailMessage };
  }
}

// // 定义一个泛型类型，表示必然包含 id number 列的 Drizzle Table
// // BUG: 类型有误，修改 CRUD 函数的类型定义
// export type BaseTable<T extends Table> = T & {
//   id: AnyColumn;
// };

// export async function read<TTable extends Table>(table: BaseTable<TTable>, id: AnyColumn) {
//   const result = await db.select().from(table).where(eq(table.id, id)).limit(1);
// }

// export async function update<TTable extends BaseTable>(
//   table: TTable,
//   id: AnyColumn,
//   data: Partial<InferInsertModel<TTable>>,
// ): Promise<InferSelectModel<TTable> | undefined> {
//   const result = await db.update(table).set(data).where(eq(table.id, id)).returning();
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
