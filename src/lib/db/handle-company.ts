import { createServerFn } from '@tanstack/react-start';
import { enterprises, enterprisesInsertSchema } from '~/lib/db/schema/enterprises.schema';
import { insert } from '~/lib/drizzle/utils';

export const handleCompsForm = createServerFn({
  method: 'POST',
})
  .inputValidator(enterprisesInsertSchema)
  .handler(async (ctx) => {
    const msg = await insert(enterprises, ctx.data);
    return msg;
  });
