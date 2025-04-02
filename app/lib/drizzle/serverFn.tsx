import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { norm_industry } from '~/lib/server/schema/industry.schema';
import { db } from '../server/db';

export const getIndustryCode = createServerFn({ method: 'GET' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    console.log(`我的ctx是：${JSON.stringify(ctx, null, 2)}\n\n\n`);
    console.log('ctx.data:', ctx.data);
    const result = await db
      .select({ code: norm_industry.code })
      .from(norm_industry)
      .where(eq(norm_industry.code, ctx.data))
      .limit(1);

    console.log('啊哈，结果是：', result[0]);
    return result[0];
  });
