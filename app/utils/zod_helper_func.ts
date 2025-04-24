// 因为react或tanstack form defaultvalues对null支持不好，所以以下校验不管是否可选参数，均强制非NULL。

import { z } from 'zod';

export const strFieldSchema = (minLength: number, maxLength: number) => {
  // 接受最大长度作为参数
  return z
    .string()
    .min(minLength, { message: `该字段最少 ${minLength} 字符` })
    .max(maxLength, { message: `该字段最多 ${maxLength} 字符` });
};

// 可选，可为空（实际应用中常遇到的场景，转空为null）字段的字符串大小限制
export const optionalStrFieldSchema = (minLength: number, maxLength: number) => {
  return z.union([
    z.literal(''), // 允许空字符串
    z
      .string()
      .trim()
      .min(minLength, { message: `不能少于 ${minLength} 个字符` })
      .max(maxLength, { message: `不能多于 ${maxLength} 个字符` }),
  ]);
};

export const mobileSchema = () => {
  return z.string().regex(/^1[0-9]{10}$/, { message: '手机号码应为11位纯数字' });
};

export const optionalMobileSchema = () => {
  return z.union([
    z.literal(''), // 允许空字符串
    z.string().regex(/^1[0-9]{10}$/, { message: '手机号码应为11位纯数字' }),
  ]);
};
