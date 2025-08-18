import { pgEnum } from 'drizzle-orm/pg-core';

// 定义企业规模的枚举类型
export const companySizeList = ['特大型', '大型', '中型', '小型', '微型'] as const;
export const companySizeEnum = pgEnum('company_size', companySizeList);
// 定义经营状况的枚举类型
export const businessStatusList = ['正常', '异常'] as const;
export const businessStatusEnum = pgEnum('business_status', businessStatusList);

// 定义三大产业的枚举类型
export const industryCategoryList = ['第一产业', '第二产业', '第三产业'] as const;
export const industryCategoryEnum = pgEnum('industry_category', industryCategoryList);

// 定义走访形式的枚举类型
export const visitTypeEnum = ['实地走访', '微信交流', '电话联系'] as const;
export const visitTypePgEnum = pgEnum('visit_type', visitTypeEnum);
export type visitTypeValues = (typeof visitTypeEnum)[number];
