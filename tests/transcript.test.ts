// 这可以通过结合 Drizzle ORM 导出的基础类型和 TypeScript 的类型操作来实现。我们需要一个类型，它：

// 1.  表示一个 Drizzle 表对象（由 `pgTable`, `mysqlTable`, `sqliteTable` 等函数返回）。
// 2.  结构上必须包含一个名为 `id` 的属性，该属性的类型是某种 Drizzle 列 (`Column`)。

// 下面是几种定义这种抽象类型的方式：

// Drizzle ORM 通常会导出一些基础类型。我们可以利用 `Table` (或特定驱动的 `PgTable`, `MySqlTable`, `SQLiteTable`) 和 `Column` 类型。
import { expect, test } from 'vitest';

// 或者更具体地，如果使用特定驱动:
import type { AnyPgColumn, PgTable } from 'drizzle-orm/pg-core';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

/**
 * 表示任何 Drizzle 表对象，其必须包含一个 'id' 列。
 * TColumnType 允许指定 id 列的具体类型，默认为任何列类型。
 */
// type DrizzleTableWithId<
//   TTable extends Table<any> = Table<any>, // 如果能引用通用 Table
//   TColumnType extends AnyColumn = AnyColumn, // 约束 id 的类型为 Drizzle Column
// > = TTable & {
//   id: TColumnType;
//   // 允许其他任何列或 Drizzle 添加的内部属性
//   [key: string | symbol]: any;
// };

// 特定于数据库驱动的变体：

/**
 * 表示任何 Drizzle PostgreSQL 表对象，其必须包含一个 'id' 列。
 */
export type PgDrizzleTableWithId<TColumnType extends AnyPgColumn = AnyPgColumn> = PgTable<any> & {
  // 使用 PgTable<any> 作为基础类型约束
  id: TColumnType;
  [key: string | symbol]: any;
};

// 定义符合要求的表
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

const categories = pgTable('categories', {
  // id: serial('id').primaryKey(), // 这个表没有 id，不符合类型
  slug: text('slug').primaryKey(),
  title: text('title'),
});

// 这个函数接受任何带有 id 列的 PostgreSQL 表
function processPgTableWithId<T extends PgDrizzleTableWithId>(table: T) {
  console.log(`Processing table: ${table.name}`);
  // 可以安全地访问 id 列定义
  console.log(`ID column type: ${table.id.getSQLType()}`);
  // table.id 存在且是 AnyPgColumn 类型
}

test('drizzle pgtable extends id', () => {
  processPgTableWithId(users); // OK
  expect(() => processPgTableWithId(categories)).toThrowError('undefined is not an object');
});
