import { createServerFn } from '@tanstack/react-start';
import { insert } from '~/lib/drizzle/utils';
import { enterprises } from '~/lib/server/schema/company.schema';
import { companySchema } from '~/lib/zod/comps-validators';

export const handleVisitsForm = createServerFn({
  method: 'POST',
})
  .validator(companySchema)
  .handler(async (ctx) => {
    console.log('进入serverFn handle: ', JSON.stringify(ctx.data, null, 2));
    const msg = await insert(enterprises, ctx.data);
    return msg;
  });
