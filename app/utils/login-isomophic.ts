import { formOptions } from '@tanstack/react-form';
import { z } from 'zod';

export const loginOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(2, { message: 'email为必填项' })
    .max(40, { message: 'E-mail最多40个字符' })
    .email({ message: '邮件格式错误' }),
  password: z
    .string()
    .min(8, { message: '密码最少8个字符' })
    .max(32, { message: '密码不能超过32个字符' }),
});
