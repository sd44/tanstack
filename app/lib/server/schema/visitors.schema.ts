import { boolean, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { enterprises } from './company.schema';

// 定义走访形式的枚举类型
export const visitTypeEnum = pgEnum('visit_type', ['实地走访', '微信交流', '电话联系']);

// 定义 visits 表
export const visits = pgTable('visits', {
  id: serial('id').primaryKey(),
  companyName: text('company_name')
    .notNull()
    .unique()
    .references(() => enterprises.companyName, { onDelete: 'cascade' }), // 企业名称[必填]
  commissioner: text('commissioner'), // 专员
  dispatchingUnit: text('dispatching_unit'), // 派出单位
  visitTime: timestamp('visit_time').notNull(), // 走访时间[必填]
  visitType: visitTypeEnum('visit_type').notNull(), // 走访形式[必填]
  // TODO: visitedPerson, position, dispatchingUnit 应另外建表，并引入外键
  visitedPerson: text('visited_person').notNull(), // 被走访人[必填]
  visitedPersonPosition: text('visited_person_position').notNull(), // 被走访人职务[必填]
  visitedPersonPhone: text('visited_person_phone').notNull(), // 被走访人电话[必填]
  visitSituation: text('visit_situation'), // 走访内容
  hasCompanyDemand: boolean('has_company_demand').notNull(), // 是否有企业诉求[是/否][必填]
  companyDemand: text('company_demand').notNull(), // 企业诉求[必填]
  isCompleted: boolean('is_completed').notNull(), // 是否办结[是/否/无诉求填-][必填]
  problemDescription: text('problem_description'), // 诉求描述
  remarkInformation: text('remark_information'), // 备注信息
  completionTime: timestamp('completion_time'), // 办结时间
  completionPersonName: text('completion_person_name'), // 办结人姓名
  completionRemark: text('completion_remark'), // 办结备注
});
