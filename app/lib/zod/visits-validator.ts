import { z } from 'zod';

import {
  mobileSchema,
  optionalMobileSchema,
  optionalStrFieldSchema,
  strFieldSchema,
} from '~/utils/zod_helper_func';

export const visitTypeValues = ['实地走访', '微信交流', '电话联系'];

// 创建基本的 Zod Schema，映射 Drizzle 字段类型
const baseVisitSchema = z.object({
  companyName: z.string({ required_error: '企业名称不能为空' }).min(1, '企业名称不能为空'),
  commissioner: z.string().nullish(), // Drizzle text() 默认 nullable
  visitTime: z.coerce.date({
    // 使用 coerce.date 接受日期对象或可转换为日期的字符串/数字
    required_error: '走访时间不能为空',
    invalid_type_error: '走访时间必须是有效日期',
  }),
  visitType: z.enum(['实地走访', '微信交流', '电话联系'], {
    // 使用从 pgEnum 获取的值
    required_error: '走访形式不能为空',
    invalid_type_error: `走访形式必须是 ${visitTypeValues.join(', ')} 中的一个`,
  }),
  visitedPerson: z.string({ required_error: '被走访人不能为空' }).min(1, '被走访人不能为空'),
  visitedPersonPosition: z
    .string({ required_error: '被走访人职务不能为空' })
    .min(1, '被走访人职务不能为空'),
  visitedPersonPhone: mobileSchema(),
  visitSituation: z.string().nullish(),
  hasCompanyDemand: z
    .boolean({
      // Drizzle boolean().notNull() 对应 z.boolean()
      required_error: '必须指明是否有企业诉求',
      invalid_type_error: '“是否有企业诉求”必须是布尔值 (true/false)',
    })
    .default(false),
  companyDemand: z.string().nullish(), // Drizzle text() 默认 nullable
  isCompleted: z.boolean().nullish(), // Drizzle boolean() 默认 nullable
  completedDescription: z.string().nullish(),
  remarkInformation: z.string().nullish(),
  completionTime: z.coerce.date().nullish(), // Drizzle timestamp() 默认 nullable
  completionPersonName: z.string().nullish(),
  completionRemark: z.string().nullish(),
});

// 使用 .superRefine 应用动态验证规则
export const visitValidationSchema = baseVisitSchema.superRefine((data, ctx) => {
  // 规则 1: 如果 hasCompanyDemand === true，则 companyDemand 和 isCompleted 必须 not null
  if (data.hasCompanyDemand) {
    // 检查 companyDemand 是否为 null, undefined 或空字符串
    if (
      data.companyDemand === null ||
      data.companyDemand === undefined ||
      data.companyDemand.trim() === ''
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // 使用自定义错误代码
        message: '企业诉求内容不能为空',
        path: ['companyDemand'], // 指明错误关联的字段
      });
    }
    // 检查 isCompleted 是否为 null 或 undefined
    // Drizzle boolean() 如果没有 .notNull() 是可以为 null 的，所以这里要确保它不是 null/undefined
    if (data.isCompleted === null || data.isCompleted === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '当“有企业诉求”时，必须明确“是否办结”状态 (true 或 false)',
        path: ['isCompleted'],
      });
    }
  }

  // 规则 2: 如果 isCompleted === true，则 completionTime 必须 not null
  // 注意：这个检查只在 isCompleted 确实为 true 时才有意义
  if (data.isCompleted === true) {
    // 检查 completionTime 是否为 null 或 undefined
    if (data.completionTime === null || data.completionTime === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '当“已办结”时，办结时间不能为空',
        path: ['completionTime'],
      });
    }
    // 根据实际需求，您可能还想在这里添加对 completionPersonName 等字段的非空验证
    // if (data.completionPersonName === null || data.completionPersonName === undefined || data.completionPersonName.trim() === "") {
    //   ctx.addIssue({ ... });
    // }
  }
});

// 可选：如果你想创建一个用于更新操作的 Schema，可能需要允许某些字段是可选的
// export const updateVisitSchema = visitValidationSchema.partial(); // 使所有字段变为可选
// 或者更精细地控制哪些字段可以更新

export type inputVisits = z.input<typeof visitValidationSchema>;
export type outputVisits = z.output<typeof visitValidationSchema>;
