import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { enterprises } from './enterprises.schema';
import { visitTypePgEnum } from './enums';

// 定义 visits 表
export const visits = pgTable('visits', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').references(() => enterprises.companyName, {
    onDelete: 'cascade',
  }), // 企业名称[必填]
  visitTime: timestamp('visit_time', {
    withTimezone: true,
    mode: 'date',
  }).notNull(), // 走访时间[必填]
  visitType: visitTypePgEnum('visit_type').notNull(), // 走访形式[必填]
  // TODO: visitedPerson, position, dispatchingUnit 应另外建表，并引入外键
  visitedPerson: text('visited_person').notNull(), // 被走访人[必填]
  visitedPersonPosition: text('visited_person_position').notNull(), // 被走访人职务[必填]
  visitedPersonPhone: text('visited_person_phone').notNull(), // 被走访人电话[必填]
  visitSituation: text('visit_situation'), // 走访内容
  hasCompanyDemand: boolean('has_company_demand').notNull(), // 是否有企业诉求[是/否][必填]
  companyDemand: text('company_demand'), // 如有企业诉求，则此项必填
  isCompleted: boolean('is_completed'), // 是否办结[是/否/ 依赖于前面的有诉求][必填]
  completedDescription: text('problem_description'), // 诉求描述
  remarkInformation: text('remark_information'), // 备注信息
  completionTime: timestamp('completion_time', {
    withTimezone: true,
    mode: 'date',
  }), // 办结时间
  completionPersonName: text('completion_person_name'), // 办结人姓名
  completionRemark: text('completion_remark'), // 办结备注
});
// export type InsertVisits = typeof visits.$inferInsert;
// export type SelectVisits = typeof visits.$inferSelect;

export const visitSelectSchema = createSelectSchema(visits);
export type visitSelectT = z.output<typeof visitSelectSchema>;
export const visitInsertSchema = createInsertSchema(visits);
export type visitInsertT = z.output<typeof visitInsertSchema>;
export const visitUpdateSchema = createUpdateSchema(visits).required({
  id: true,
}); // 确保 id 字段是必填的
export type visitUpdateT = z.output<typeof visitUpdateSchema>;

// 使用 .superRefine 应用动态验证规则
export const visitInsertPlusSchema = visitInsertSchema.check((ctx) => {
  const data = ctx.value;
  // 规则 1: 如果 hasCompanyDemand === true，则 companyDemand 和 isCompleted 必须 not null
  if (data.hasCompanyDemand) {
    // 检查 companyDemand 是否为 null, undefined 或空字符串
    if (!data.companyDemand || data.companyDemand.trim() === '') {
      ctx.issues.push({
        code: 'custom', // 使用自定义错误代码
        message: '企业诉求内容不能为空',
        path: ['companyDemand'], // 指明错误关联的字段
        input: data.companyDemand, // 当前被校验的输入数据
      });
    }
    // 检查 isCompleted 是否为 null 或 undefined
    // Drizzle boolean() 如果没有 .notNull() 是可以为 null 的，所以这里要确保它不是 null/undefined
    if (data.isCompleted === null || data.isCompleted === undefined) {
      ctx.issues.push({
        code: 'custom',
        message: '如有“企业诉求”必须明确“是否办结”',
        path: ['isCompleted'],
        input: data.isCompleted,
      });
    }
  }

  // 规则 2: 如果 isCompleted === true，则 completionTime 必须 not null
  // 注意：这个检查只在 isCompleted 确实为 true 时才有意义
  if (data.isCompleted && !data.completionTime) {
    ctx.issues.push({
      code: 'custom',
      message: '当“已办结”时，办结时间不能为空',
      path: ['completionTime'],
      input: data.completionTime,
    });
  }
});
