import { fetchVisitsDatas } from '~/components/myui/listVisit';
import { test } from 'vitest';

test('fetch VisitsDatas', async () => {
  const data = await fetchVisitsDatas();
  console.log(JSON.stringify(data));
});
