import { db } from '~/lib/server/db';
import { enterprises } from '~/lib/server/schema';

import { expect, test } from 'vitest';

async function fetchCompDatas() {
  const result = await db.select().from(enterprises);
  const datas = result.map((item, index) => {
    return {
      ...item,
      id: index + 1,
    };
  });
  console.error('数据条数: ', datas);
  return datas.length;
}

test('faker zh_CN', async () => {
  const length = await fetchCompDatas();
  expect(length > 2000);
});
