// import { expect, test } from 'bun:test';
// import { createServerFn } from '@tanstack/react-start';
// import * as z from 'zod';
// import { getRouter } from '~/router';

// test('basic { queryClient } context', async () => {
//   const myRouter = getRouter();
//   expect(myRouter).toBeDefined();

//   const result = await visitReadById({ data: { id: 1000 } });
//   console.log('result:', result);
//   // expect(result).toBeInteger();
//   expect(result).toBe(1000);
// });

// const visitReadById = createServerFn({ method: 'POST' })
//   .inputValidator(z.object({ id: z.int() }))
//   .handler(({ data }) => {
//     console.log('data.id:', data.id);
//     return data.id;
//   });
