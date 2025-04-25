import { getTableName } from 'drizzle-orm';
import type { PgTable, TableConfig } from 'drizzle-orm/pg-core';
import { db } from '~/lib/server/db';
import { generateRandomComp } from '~/utils/company-isomophic';
import { enterprises } from '../server/schema';

import industry from '~/lib/server/schema/industry.json';
import { norm_industry } from '../server/schema';

import { fakerZH_CN as faker } from '@faker-js/faker';
import { APIError } from 'better-auth/api';
import { auth } from '../server/auth';

async function signUpUsers() {
  // 包裹在一个 async 函数中，避免顶层 await
  let id = 1;

  for (let i = 1; i <= 25; i++) {
    try {
      await auth.api.signUpEmail({
        body: {
          name: `user${id}`,
          email: `user${id}@1.com`,
          password: '12345678',
          image: faker.image.personPortrait({ size: 256 }),
        },
      });
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message, error.status);
      }
    }
    console.log(`user${id}@x.com`);
    id += 1;
  }
}

console.log('开始创建 25 名用户');
await signUpUsers(); // 调用 async 函数
console.log('成功创建 25 名用户');

export async function seedTasks<T extends object>(
  randomObjGenerator: () => T,
  tableName: PgTable<TableConfig>,
  length: number = 100,
) {
  if (length < 1) {
    length = 100;
  }

  try {
    const datas = Array.from({ length }, randomObjGenerator);
    console.log(`开始插入：数据表 ${getTableName(tableName)} 种子数据： ${datas.length}条`);
    await db.insert(tableName).values(datas).onConflictDoNothing();
    console.log(`完成插入：数据表 ${getTableName(tableName)} 种子数据： ${datas.length}条`);
  } catch (err) {
    console.error(err);
  }
}

console.log('开始插入 行业代码数据');
await db.insert(norm_industry).values(industry).onConflictDoNothing();
console.log('完成插入 行业代码数据\n\n');

console.log('开始插入 企业代码数据');
try {
  await generateRandomComp();

  console.log('完成插入 企业代码数据\n\n');
} catch (err) {
  console.log(err);
} finally {
}

import { generateRandomVisits } from '~/utils/visits-isomophic';

console.log('开始插入 企业走访数据');
try {
  await generateRandomVisits();

  console.log('完成插入 企业走访数据\n\n');
} catch (err) {
  console.log(err);
}
