import { integer, numeric, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { norm_industry } from './industry.schema';
import { user } from './auth.schema';

// 定义企业规模的枚举类型
export const companySizeEnum = pgEnum('company_size', ['特大型', '大型', '中型', '小型', '微型']);

// 定义经营状况的枚举类型
export const businessStatusEnum = pgEnum('business_status', ['正常', '异常']);

// 定义三大产业的枚举类型
export const industryEnum = pgEnum('industry', ['第一产业', '第二产业', '第三产业']);

// 定义 enterprises 表
export const enterprises = pgTable('enterprises', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').unique().notNull(), // 企业名称[必填]
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
  registeredCapital: numeric('registered_capital', { mode: 'number' }).notNull(),
  // TODO: 服务专员、录入人、录入单位名称不在表单，需额外建表，在提交时处理。
  servicerId: text('servicer_id').references(() => user.id), // 服务专员
  recorderId: text('recorder_id').references(() => user.id), // 录入人
  industryCategory: industryEnum('industry_category').notNull(), // 三大产业[必填]
  industryCode: text('industry_code')
    .notNull()
    .references(() => norm_industry.code, { onDelete: 'cascade' }), // 行业分类[必填]
  // TODO: 录入单位在表单提交时处理
  recordingUnitName: text('recording_unit_name'), // 录入单位名称
});

export type InsertEnterprises = typeof enterprises.$inferInsert;
export type SelectEnterprises = typeof enterprises.$inferSelect;
