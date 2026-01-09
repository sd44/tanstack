import { createMiddleware } from '@tanstack/react-start';
import { logger } from '~/lib/pino-logger';

export const pinoLogMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next, data, context }) => {
    // 记录传入的请求数据
    logger.info({ msg: 'Incoming request', data, context });

    try {
      // 执行下一个中间件或服务器函数
      const result = await next();

      // 记录成功的响应
      logger.info({ msg: 'Request processed successfully', result });

      return result;
    } catch (error) {
      // 记录发生的错误
      logger.error({ msg: 'Error processing request', error });

      // 重新抛出错误，以便其他错误处理机制捕获
      throw error;
    }
  },
);
