import { db } from '../index';
import { enterprises, visits } from '../schema';

async function debugQueries() {
  // 1. 查询enterprises表
  const enterprisesData = await db.select().from(enterprises);
  console.log('Enterprises data (first 5):', enterprisesData.slice(0, 5));
  console.log('Total enterprises:', enterprisesData.length);

  // 2. 查询visits表
  const visitsData = await db.select().from(visits);
  console.log('Visits data (first 5):', visitsData.slice(0, 5));
  console.log('Total visits:', visitsData.length);

  // 3. 查询所有不同的servicerId
  const servicerIds = await db
    .select({ servicerId: enterprises.servicerId })
    .from(enterprises)
    .groupBy(enterprises.servicerId);
  console.log(
    'All servicerIds:',
    servicerIds.filter((x) => x.servicerId),
  );
}

debugQueries().catch(console.error);
