import { db } from '~/lib/server/db';
import { eq } from 'drizzle-orm';
import { enterprises, InsertEnterprises, user } from '~/lib/server/schema';

import { fakerZH_CN as faker } from '@faker-js/faker';
import { industryCodeList } from '~/lib/zod/comps-validators';

export async function generateRandomComp() {
  try {
    const userResults = await db.select({ id: user.id }).from(user);
    // 从结果数组中提取 id
    const idLst = userResults.map((item) => item.id);

    const adminIds = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, 'user24@1.com'))
      .limit(1);

    await db.update(user).set({ role: 'admin' }).where(eq(user.id, adminIds[0].id));

    const datas = [];
    for (let i = 0; i < 1000; i++) {
      datas.push({
        companyName: faker.company.name(),
        address: faker.location.city() + faker.location.streetAddress(),
        legalPersonName: faker.person.fullName(),
        legalPersonPhone: faker.helpers.fromRegExp('1[0-9]{10}'),
        contactPerson: faker.person.fullName(),
        contactPersonPhone: faker.helpers.fromRegExp('1[0-9]{10}'),
        companySize: faker.helpers.arrayElement(['特大型', '大型', '中型', '小型', '微型']),
        registeredCapital: faker.number.float({ min: 0, max: 3000, fractionDigits: 1 }),
        employeeCount: faker.number.int({ min: 1, max: 1000 }),
        businessStatus: faker.helpers.arrayElement(['正常', '异常']),
        industryCategory: faker.helpers.arrayElement(['第一产业', '第二产业', '第三产业']),
        industryCode: faker.helpers.arrayElement(industryCodeList),
        // 生成user1到25@1.com， 硬解码
        servicerId: faker.helpers.arrayElement(idLst),
        recorderId: adminIds[0].id,
        recordingUnitName: '高新区',
      });
    }
    console.log('datas的长度是', datas.length);
    await db.insert(enterprises).values(datas as InsertEnterprises[]);

    // console.log('datas是', datas[0]);
    // for (let j = 0; j < 10; j++) {
    //   db.insert(enterprises).values(datas[j]);
    // }
  } catch (err) {
    console.error(err);
  }
}
