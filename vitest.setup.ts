// vitest.setup.ts
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

// 加载 .env 文件
const env = config({ path: '.env' });
// 如果您使用了 .env.local 等，也可以在这里加载
// config({ path: '.env.local' });

// 某些情况下需要 expand 来处理变量引用，例如 DATABASE_URL=${DB_HOST}/...
expand(env);

// 确保你的数据库连接是在环境变量加载后再初始化的
// 在这里你可以放置一些全局的测试设置，例如模拟数据库连接
// 但更常见的做法是让 drizzle 在第一次被导入时才尝试连接，并确保环境变量已经存在
