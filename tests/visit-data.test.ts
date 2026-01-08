// import { expect, mock, test } from 'bun:test';
// import { eq } from 'drizzle-orm';
// import { db } from '~/lib/db';
// import {
//   visitCreate,
//   visitDelById,
//   visitReadById,
//   visitUpdateById,
// } from '~/lib/db/CRUD/visit-datas';
// import { visits } from '~/lib/db/schema';

// // Mock hasPermission to always return true
// mock.module('~/lib/db/CRUD/visitDatas', () => {
//   const original = import.meta.require('~/lib/db/CRUD/visitDatas');
//   return {
//     ...original,
//     hasPermission: () => Promise.resolve(true),
//   };
// });

// // Remove delVisitById since we're testing the functions from visitDatas.ts

// // Test data matching the visit schema
// const testVisit = {
//   visitTime: new Date('2025-04-18T15:04:05.996Z'),
//   visitType: '电话联系' as const,
//   visitedPerson: '鲜斌',
//   visitedPersonPosition: 'Analyst',
//   visitedPersonPhone: '16743712090',
//   visitSituation: '正常走访',
//   hasCompanyDemand: false,
//   companyName: '武阳市俊驰物流有限责任公司',
//   companyDemand: null,
//   isCompleted: null,
//   completedDescription: null,
//   remarkInformation: null,
//   completionTime: null,
//   completionPersonName: null,
//   completionRemark: null,
// };

// test('visitReadById', async () => {
//   // First create a test visit
//   const created = await visitCreate({ data: testVisit });

//   // Then try to read it
//   const result = await visitReadById({ data: { id: created.id } });
//   expect(result).toBeDefined();
// });

// test('visitUpdateById', async () => {
//   const created = await visitCreate({ data: testVisit });
//   const updated = await visitUpdateById({
//     data: {
//       id: created.id,
//       visitType: '实地走访' as const,
//     },
//   });
//   expect(updated).toBeDefined();
//   expect(updated.visitType).toBe('实地走访');
// });

// test('visitDelById', async () => {
//   const created = await visitCreate({ data: testVisit });
//   await visitDelById({ data: { id: created.id } });

//   // Verify deletion
//   const result = await db.select().from(visits).where(eq(visits.id, created.id));
//   expect(result.length).toBe(0);
// });

// test('visitCreate', async () => {
//   const result = await visitCreate({ data: testVisit });
//   expect(result).toBeDefined();
//   expect(result.id).toBeDefined();
// });
