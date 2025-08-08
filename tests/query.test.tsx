import { expect, test } from 'bun:test';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod/v4';
import { createRouter } from '~/router';

test('basic { queryClient } context', async () => {
  const myRouter = createRouter();
  expect(myRouter).toBeDefined();

  const result = await visitReadById({ data: { id: 1000 } });
  expect(result).toBeDefined();
  expect(result === 2);
});

const visitReadById = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.int() }))
  .handler(({ data }) => {
    return data.id;
  });
