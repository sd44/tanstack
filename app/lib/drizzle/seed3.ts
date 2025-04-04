import { fakerZH_CN as faker } from '@faker-js/faker';
import { APIError } from 'better-auth/api';
import { auth } from '../server/auth';

async function signUpUsers() {
  // 包裹在一个 async 函数中，避免顶层 await
  let id = 1;

  for (let i = 0; i < 100; i++) {
    try {
      await auth.api.signUpEmail({
        body: {
          name: `user${id}`,
          email: `user${id}@1.com`,
          password: '12345678',
          image: faker.image.personPortrait({ size: 64 }),
        },
      });
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message, error.status);
      }
    }
    console.log(`user${id}@x.co`);
    id += 1;
  }
}

console.log('开始创建 100 名用户');
await signUpUsers(); // 调用 async 函数
console.log('成功创建 100 名用户');
