import { formOptions } from '@tanstack/react-form';
import * as z from 'zod';

export const signUpOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  },
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: '姓名最少2字' }).max(15, { message: '姓名最多15字' }),
    email: z
      .string()
      .min(2, { message: 'email为必填项' })
      .max(40, { message: 'E-mail最多40个字符' })
      .email({ message: '邮件格式错误' }),
    password: z
      .string()
      .min(8, { message: '密码最少8个字符' })
      .max(32, { message: '密码不能超过32个字符' }),
    confirm_password: z
      .string()
      .min(8, { message: '密码最少8个字符' })
      .max(32, { message: '密码不能超过32个字符' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: '密码和确认密码不匹配',
    path: ['confirm_password'], // path of error
  });
