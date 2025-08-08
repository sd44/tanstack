import { createServerFn } from '@tanstack/react-start';
import { id } from 'date-fns/locale';
import { desc, eq, inArray } from 'drizzle-orm';
import { getUser } from '~/lib/auth/functions/getuser';
import { db } from '~/lib/db';
import {
  enterprises,
  visitInsertPlusSchema,
  visitSelectSchema,
  type visitSelectT,
  visits,
  visitUpdateSchema,
} from '~/lib/db/schema';

export async function ttt() {
  return await hasPermission(100_000);
}

export const hasPermission = async (visitId: number) => {
  const user = await getUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('userId不存在');
  }

  const myCompsSubquery = await db
    .select({ servicerId: enterprises.servicerId }) // <--- 选择需要用于 IN 条件的列
    .from(enterprises)
    .leftJoin(visits, eq(enterprises.companyName, visits.companyName))
    .where(eq(visits.id, visitId));

  // servicerId是否与userId匹配
  return myCompsSubquery.some((comp) => comp.servicerId === userId);
};

export const visitReadMyDatas = createServerFn({ method: 'GET' }).handler(
  async (): Promise<visitSelectT[]> => {
    try {
      const user = await getUser();
      const userId = user?.id;
      if (!userId) {
        console.error('userId不存在');
        return [];
      }

      // 1. 构建子查询，注意这里 *不* 加 await，与下方where形成JOIN查询
      const myCompsSubquery = db
        .select({ data: enterprises.companyName }) // <--- 选择需要用于 IN 条件的列
        .from(enterprises)
        .where(eq(enterprises.servicerId, userId));

      // 2. 将子查询直接传递给 inArray
      // Drizzle 会生成类似 "... WHERE visits.companyName IN (SELECT enterprises.companyName FROM enterprises WHERE ...)" 的 SQL
      const preq = db
        .select()
        .from(visits)
        .where(inArray(visits.companyName, myCompsSubquery))
        .orderBy(desc(visits.visitTime));

      const results = await preq;
      console.log('visitReadMyDatas results: ', results.length);
      return results;
    } catch (error) {
      console.error('Failed to fetch visit data:', error);
      return [];
    }
  },
);

const visitIdSchema = visitSelectSchema.pick({ id: true });

export const visitReadById = createServerFn({ method: 'POST' })
  .validator(visitIdSchema) // 允许部分更新
  .handler(async ({ data }) => {
    if ((await hasPermission(data.id)) === false) {
      throw new Error(`没有权限获取ID为 ${data.id} 的走访记录`);
    }
    const result = await db.select().from(visits).where(eq(visits.id, data.id));

    if (result.length === 0) {
      throw new Error(`未找到ID为 ${data.id} 的走访记录`);
    }

    return result[0];
  });

export const visitUpdateById = createServerFn({ method: 'POST' })
  .validator(visitUpdateSchema) // 允许部分更新
  .handler(async ({ data: newData }) => {
    if ((await hasPermission(newData.id)) === false) {
      throw new Error(`没有权限更新ID为 ${id} 的走访记录`);
    }

    const result = await db
      .update(visits)
      .set(newData)
      .where(eq(visits.id, newData.id))
      .returning();

    if (result.length === 0) {
      throw new Error(`未找到ID为 ${newData.id} 的走访记录`);
    }

    return result[0];
  });

export const visitDelById = createServerFn({ method: 'POST' })
  .validator(visitIdSchema) // 确保传入的 id 是一个数字
  .handler(async ({ data }) => {
    const visitId = data.id;
    if ((await hasPermission(visitId)) === false) {
      throw new Error(`没有权限删除ID为 ${visitId} 的走访记录`);
    }
    // delete语句如何join查询其他表
    await db.delete(visits).where(eq(visits.id, visitId));
  });

export const visitCreate = createServerFn({
  method: 'POST',
})
  .validator(visitInsertPlusSchema)
  .handler(async ({ data }) => {
    const result = await db.insert(visits).values(data).returning();
    if (!result || result.length === 0) {
      throw new Error(`插入失败: ${JSON.stringify(data, null, 2)}`);
    }
    return result[0];
  });

export const fetchMyComps = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getUser();
  const userId = user?.id;
  if (!userId) {
    console.error('userId不存在');
    throw new Error('userId不存在');
  }

  const myCompsSubquery = await db
    .select({ data: enterprises.companyName }) // <--- 选择需要用于 IN 条件的列
    .from(enterprises)
    .where(eq(enterprises.servicerId, userId));
  return myCompsSubquery.map((item) => item.data);
});
