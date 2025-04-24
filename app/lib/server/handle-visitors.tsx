import { createServerFn } from '@tanstack/react-start';
import { insert } from '~/lib/drizzle/utils';
import { visits } from '~/lib/server/schema/visits.schema';
import { visitValidationSchema } from '../zod/visits-validator';

import { db } from './db';
import { enterprises } from './schema';
import { eq } from 'drizzle-orm';
import { getUser } from './getuser';

export const handleVisitsForm = createServerFn({
  method: 'POST',
})
  .validator(visitValidationSchema)
  .handler(async (ctx) => {
    console.log('进入serverFn handle: ', JSON.stringify(ctx.data, null, 2));
    const msg = await insert(visits, ctx.data);
    return msg;
  });

export const fetchMyComps = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getUser();
  const userId = user?.id;
  console.log('userId is: ', userId);
  if (!userId) {
    throw new Error('userId不存在');
  }

  const myCompsSubquery = await db
    .select({ data: enterprises.companyName }) // <--- 选择需要用于 IN 条件的列
    .from(enterprises)
    .where(eq(enterprises.servicerId, userId));

  console.log('数据条数: ', myCompsSubquery.length);
  return myCompsSubquery.map((item) => item.data);
});
