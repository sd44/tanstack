import { formOptions } from '@tanstack/react-form';
import { z } from 'zod/v4';

export const loginOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
});

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: '密码最少8个字符' })
    .max(32, { message: '密码不能超过32个字符' }),
});
