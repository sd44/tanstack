import { visits } from '~/lib/server/schema/visits.schema';
import { fakerZH_CN as faker } from '@faker-js/faker';
import { db } from '~/lib/server/db';

import { enterprises } from '~/lib/server/schema';

export async function generateRandomVisits() {
  const datas: (typeof visits.$inferInsert)[] = []; // Change to use Drizzle's inferred insert type

  const comps = await db.select({ companyName: enterprises.companyName }).from(enterprises);
  const compsLst = comps.map((item) => item.companyName);

  for (const val of compsLst) {
    const visitTimestamp = faker.date.between({ from: '2025-01-01', to: Date.now() });
    const completime = new Date(visitTimestamp.getTime() + 1000 * 60 * 60 * 20);
    const hasDemand = faker.datatype.boolean();

    const record: typeof visits.$inferInsert = {
      // Use Drizzle's inferred insert type
      companyName: val,
      visitTime: visitTimestamp,
      visitType: faker.helpers.arrayElement(['实地走访', '微信交流', '电话联系']),
      visitedPerson: faker.person.fullName(),
      visitedPersonPosition: faker.person.jobType(),
      visitedPersonPhone: faker.helpers.fromRegExp('1[0-9]{10}'),
      visitSituation: '正常走访',
      hasCompanyDemand: hasDemand,
      companyDemand: hasDemand ? faker.lorem.lines() : null, // Explicitly set to null when not present
      isCompleted: hasDemand ? faker.datatype.boolean() : null, // Explicitly set to null when not present
      completedDescription: null,
      remarkInformation: null,
      completionTime: null,
      completionPersonName: null,
      completionRemark: null,
    };

    if (hasDemand && record.isCompleted) {
      record.completedDescription = faker.lorem.lines();
      record.completionTime = completime;
    }
    datas.push(record);
  }
  await db.insert(visits).values(datas).onConflictDoNothing();
}
