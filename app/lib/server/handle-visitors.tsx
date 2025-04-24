import { createServerFn } from '@tanstack/react-start';
import { insert } from '~/lib/drizzle/utils';
import { visits } from '~/lib/server/schema/visits.schema';
import { visitValidationSchema } from '../zod/visits-validator';

export const handleVisitsForm = createServerFn({
  method: 'POST',
})
  .validator(visitValidationSchema)
  .handler(async (ctx) => {
    console.log('进入serverFn handle: ', JSON.stringify(ctx.data, null, 2));
    const msg = await insert(visits, ctx.data);
    return msg;
  });
