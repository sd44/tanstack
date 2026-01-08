import { integer, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import * as z from 'zod';
import {
  optionalMobileSchema,
  optionalStrFieldSchema,
  strFieldSchema,
} from '~/utils/zod-helper-func';
import { user } from './auth.schema';
import { businessStatusEnum, companySizeEnum, industryCategoryEnum } from './enums';
import { norm_industry } from './industry.schema';

// 定义 enterprises 表
export const enterprises = pgTable('enterprises', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull().unique(), // 企业名称[必填]
  address: text('address').notNull(), // 地址[必填]
  legalPersonName: text('legal_person_name').notNull(), // 法人姓名[必填]
  legalPersonPhone: text('legal_person_phone').notNull(), // 法人电话[必填]
  companySize: companySizeEnum('company_size').notNull(), // 企业规模[必填]
  businessScope: text('business_scope'), // 经营范围
  businessStatus: businessStatusEnum('business_status').notNull(), // 经营状况[必填]
  contactPerson: text('contact_person'), // 联系人
  contactPersonPhone: text('contact_person_phone'), // 联系人电话
  employeeCount: integer('employee_count').notNull(), // 员工人数[必填]
  // 注册资本[必填][单位为万元] 默认情况下，为免精度损失，drizzle会将pgsql
  // numeric转为 js string。因我们的数据较小，存储为number不会影响精度，所以强制
  // 指定。
  registeredCapital: numeric('registered_capital', {
    mode: 'number',
  }).notNull(),
  // TODO: 服务专员、录入人、录入单位名称不在表单，需额外建表，在提交时处理。
  servicerId: text('servicer_id').references(() => user.id), // 服务专员
  recorderId: text('recorder_id').references(() => user.id), // 录入人
  industryCategory: industryCategoryEnum('industry_category').notNull(), // 三大产业[必填]
  industryCode: text('industry_code')
    .notNull()
    .references(() => norm_industry.code, { onDelete: 'cascade' }), // 行业分类[必填]
  // TODO: 录入单位在表单提交时处理
  recordingUnitName: text('recording_unit_name'), // 录入单位名称
});

export const enterprisesSelectSchema = createSelectSchema(enterprises, {
  contactPerson: optionalStrFieldSchema(2, 20),
  contactPersonPhone: optionalMobileSchema(),
  companyName: strFieldSchema(2, 50),
  //  带有schema 的匿名函数是对原模式的补充验证，而非覆盖验证
  // employeeCount: (shema) => shema.gte(0, '员工人数必须大于等于0'),
  // registeredCapital: (schema) => schema.gte(0, '注册资金必须大于等于0'),

  // 以下为覆盖验证
  employeeCount: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val), { message: '员工数量必须是有效数字' })
    .refine((val) => Number.isInteger(val) && val >= 0, { message: '员工数量必须是正整数' }),
  registeredCapital: z
    .string()
    .transform((val) => Number(val)) // 将字符串转换为数字
    .refine((val) => !Number.isNaN(val), { message: '注册资本必须是有效数字' }) // 验证是否是数字
    .refine((val) => val > 0, { message: '注册资本必须大于0' }), // 业务逻辑验证

  // TODO: 以下三项暂未做限制
  // servicerId
  // recorderId
  // recordingUnitName
});
export type enterprisesSelectT = z.output<typeof enterprisesSelectSchema>;

export const enterprisesUpdateSchema = enterprisesSelectSchema.partial();
export type enterprisesUpdateT = z.input<typeof enterprisesUpdateSchema>;

export const enterprisesInsertSchema = enterprisesSelectSchema.omit({
  id: true,
});
export type enterprisesInserT = z.input<typeof enterprisesInsertSchema>;
