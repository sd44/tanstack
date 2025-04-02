import { fakerZH_CN as faker } from '@faker-js/faker';
import { db } from '~/lib/server/db';
import { user } from '~/lib/server/schema/auth.schema';

import { eq } from 'drizzle-orm';

for (let i = 0; i < 100; i++) {
  const name = `user${i}`;
  const image = faker.image.personPortrait();
  console.log('image图像是：', image);
  const result = await db
    .update(user)
    .set({ image })
    .where(eq(user.name, name))
    .returning({ image: user.image });
  console.log(result);
}
