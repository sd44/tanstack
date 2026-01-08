import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { enterprises, norm_industry } from '../schema';

export const entryReadMydatas = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const result = await db.select().from(enterprises);
    const datas = result.map((item, index) => {
      return {
        ...item,
        id: index + 1,
      };
    });
    console.log('Server function is about to return (success):', datas.length);
    return datas;
  } catch (error) {
    console.error('Failed to fetch enterprises data:', error);
    console.log('Server function is about to return (error):', []);
    return [];
  }
});

export const getIndustryCode = createServerFn({ method: 'GET' })
  .inputValidator((data: string) => data)
  .handler(async (ctx) => {
    const result = await db
      .select({ code: norm_industry.code })
      .from(norm_industry)
      .where(eq(norm_industry.code, ctx.data))
      .limit(1);
    return result[0];
  });

export const getEntriesOpt = () =>
  queryOptions({
    queryKey: ['getentries'],
    queryFn: async () => await entryReadMydatas(),
  });
