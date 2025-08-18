import { expect, test } from 'bun:test';
import * as z from 'zod';

import { flatten_zod, flattenRecord } from '~/utils/zod-flattern-msg';

test('flatten zod safeparse', () => {
  const FormData = z.object({
    name: z.string(),
    contactInfo: z.object({
      email: z.email(),
      phone: z.string().optional(),
    }),
  });

  const result = FormData.safeParse({
    name: null,
    contactInfo: {
      email: 'not an email',
      phone: '867-5309',
    },
  });

  expect(result.success).toBeFalsy();
  const x = flatten_zod(result);
  expect(x).toBeDefined();
});

test('flatten nested record', () => {
  const input = {
    user: {
      key_value_map: {
        CreatedDate: '123424',
        Department: {
          Name: 'XYZ',
        },
      },
    },
  };

  const flattened = flattenRecord(input);
  expect(flattened).toEqual({
    'user.key_value_map.CreatedDate': '123424',
    'user.key_value_map.Department.Name': 'XYZ',
  });
});
