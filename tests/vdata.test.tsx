// import { expect, mock, test } from 'bun:test';

// mock.module('~/lib/db/CRUD/visitDatas.ts', async () => {
//   const origin = await import('~/lib/db/CRUD/visit-datas');
//   return {
//     ...origin,
//     hasPermission: (_id: number) => {
//       return true;
//     },
//   };
// });

// test('basic permission test', async () => {
//   const esm = await import('~/lib/db/CRUD/visit-datas');
//   expect(await esm.hasPermission(3222)).toBe(true);
// });

// test('set button text', () => {
//   document.body.innerHTML = '<button>My button</button>';
//   const button = document.querySelector('button');
//   expect(button?.innerText).toEqual('My button');
// });

// // // Simple server function test
// // export const testFn = createServerFn({ method: 'POST' })
// //   .inputValidator(z.object({ id: z.number() }))
// //   .handler(async ({ data }) => data.id);

// // test('server function', async () => {
// //   expect(await testFn({ data: { id: 1 } })).toBe(1);
// // });
