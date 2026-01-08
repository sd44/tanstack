import { fakerZH_CN as faker } from '@faker-js/faker';
import { APIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import type { PgTable, TableConfig } from 'drizzle-orm/pg-core';
import { db } from '~/lib/db';
import { norm_industry, user, visits } from '~/lib/db/schema';
import {
  enterprises,
  type enterprisesInserT,
  enterprisesInsertSchema,
} from '~/lib/db/schema/enterprises.schema';
import industryCodeList from '~/lib/db/schema/industry.json' with { type: 'json' };
import industry from '~/lib/db/schema/industry.json' with { type: 'json' };
import { auth } from '../auth/auth';

async function signUpUsers() {
  // 包裹在一个 async 函数中，避免顶层 await
  let id = 1;
  const signUpPromises: Promise<unknown>[] = [];

  for (let i = 1; i <= 25; i++) {
    const promise = auth.api
      .signUpEmail({
        body: {
          name: `user${id}`,
          email: `user${id}@1.com`,
          password: '12345678',
          image: faker.image.personPortrait({ size: 256 }),
        },
      })
      .catch((error) => {
        if (error instanceof APIError) {
          console.error(`用户 ${id} 注册失败: ${error.message}`);
        } else {
          console.error(`用户 ${id} 注册失败: ${error}`);
        }
      });
    signUpPromises.push(promise);
    id += 1;
  }
  await Promise.all(signUpPromises);
}

console.log('开始注册用户');
await signUpUsers(); // 调用 async 函数
console.log('完成注册用户');

export async function seedTasks<T extends object>(
  randomObjGenerator: () => T,
  tableName: PgTable<TableConfig>,
  length = 100,
) {
  let len = length;
  if (length < 1) {
    len = 100;
  }

  try {
    const datas = Array.from({ length: len }, randomObjGenerator);
    await db.insert(tableName).values(datas).onConflictDoNothing();
  } catch (_err) {
    console.error(`插入数据到 ${tableName} 失败`, _err);
  }
}
await db.insert(norm_industry).values(industry).onConflictDoNothing();
try {
  await generateRandomComp();
  await generateRandomVisits();
} catch (_err) {
  console.log(_err);
}

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

    const datas: enterprisesInserT[] = [];
    for (let i = 0; i < 1000; i++) {
      datas.push({
        companyName: faker.company.name(),
        address: faker.location.city() + faker.location.streetAddress(),
        legalPersonName: faker.person.fullName(),
        legalPersonPhone: faker.helpers.fromRegExp('1[0-9]{10}'),
        contactPerson: faker.person.fullName(),
        contactPersonPhone: faker.helpers.fromRegExp('1[0-9]{10}'),
        companySize: faker.helpers.arrayElement(['特大型', '大型', '中型', '小型', '微型']),
        registeredCapital: faker.number
          .float({
            min: 0,
            max: 3000,
            fractionDigits: 1,
          })
          .toString(),
        businessScope: '', // Ensure empty string, not null
        employeeCount: faker.number.int({ min: 1, max: 1000 }).toString(),
        businessStatus: faker.helpers.arrayElement(['正常', '异常']),
        industryCategory: faker.helpers.arrayElement(['第一产业', '第二产业', '第三产业']),
        industryCode: faker.helpers.arrayElement(industryCodeList).code,
        // 生成user1到25@1.com， 硬解码
        servicerId: faker.helpers.arrayElement(idLst),
        recorderId: adminIds[0].id,
        recordingUnitName: '高新区', // Ensure non-null string
      });
    }
    const xx = datas.map((item) => {
      return enterprisesInsertSchema.parse(item);
    });
    await db.insert(enterprises).values(xx).onConflictDoNothing();

    // console.log('datas是', datas[0]);
    // for (let j = 0; j < 10; j++) {
    //   db.insert(enterprises).values(datas[j]);
    // }
  } catch (_err) {
    console.error('插入企业数据失败', _err);
  }
}
console.log('开始生成企业数据');
await generateRandomComp();
console.log('结束生成企业数据');

export async function generateRandomVisits() {
  const datas: (typeof visits.$inferInsert)[] = []; // Change to use Drizzle's inferred insert type

  const comps = await db.select({ companyName: enterprises.companyName }).from(enterprises);
  const compsLst = comps.map((item) => item.companyName);

  for (const val of compsLst) {
    const visitTimestamp = faker.date.between({
      from: '2025-01-01',
      to: Date.now(),
    });
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
console.log('开始生成走访数据');
await generateRandomVisits();
console.log('完成生成走访数据');
