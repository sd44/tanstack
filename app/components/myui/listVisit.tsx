import { createServerFn } from '@tanstack/react-start';
import { ColumnDef } from '@tanstack/react-table';
import { db } from '~/lib/server/db';
import { InsertVisits, SelectVisits, visits, enterprises } from '~/lib/server/schema';
import { fetchDatas } from '~/lib/table/fetchdatas';
import { Filters, PaginatedData } from '~/lib/table/types';
import { eq, inArray } from 'drizzle-orm';

export const fetchVisitsDatas = createServerFn({ method: 'GET' }).handler(async () => {
  // 模拟 user，在实际应用中替换为真实用户
  const user = 'user2'; // <-- 请替换为实际的用户标识

  // 1. 构建子查询，注意这里 *不* 加 await
  const myCompsSubquery = db
    .select({ data: enterprises.companyName }) // <--- 选择需要用于 IN 条件的列
    .from(enterprises)
    .where(eq(enterprises.serviceCommissioner, user));

  // 2. 将子查询直接传递给 inArray
  // Drizzle 会生成类似 "... WHERE visits.companyName IN (SELECT enterprises.companyName FROM enterprises WHERE ...)" 的 SQL
  const results = await db
    .select()
    .from(visits)
    .where(inArray(visits.companyName, myCompsSubquery));
  // <-- 直接传递子查询

  console.log('results :' + results);

  // Drizzle 通常会自动处理好 select({...}) 中的列名映射，只要子查询只选择了一列即可。
  // 如果子查询选择了多列，你可能需要使用 .fields() 或明确指定只选择一个 simple column。
  // 在这个例子中，`select({ comp: enterprises.companyName })` Drizzle 能理解是想要用 `enterprises.companyName` 这一列的值。
  const datas = results.map((item, index) => {
    return {
      ...item,
      id: index + 1,
    };
  });
  console.log('数据条数: ', datas.length);
  return datas;
});

export type CompFilters = Filters<SelectVisits>;

export async function fetchComps(
  filtersAndPagination: CompFilters,
): Promise<PaginatedData<SelectVisits>> {
  try {
    const datas = await fetchVisitsDatas();

    console.log(datas);
    console.log('fetchVisits', filtersAndPagination);
    return fetchDatas(filtersAndPagination, datas);
  } catch (err) {
    console.error('错误啦\n\n\n');
    console.error(err);
    throw err;
  }
}

interface columnDefMeta {
  key: keyof SelectVisits;
  head: string;
  filterVariant?: 'text' | 'number';
}

const compColumns: columnDefMeta[] = [
  { key: 'id', head: '序号', filterVariant: 'number' },
  { key: 'companyName', head: '企业名称', filterVariant: 'text' },
  { key: 'visitTime', head: '走访时间', filterVariant: 'text' },
  { key: 'visitType', head: '走访类型', filterVariant: 'text' },
  { key: 'visitedPerson', head: '被走访人', filterVariant: 'text' },
  { key: 'visitedPersonPosition', head: '走访人职务', filterVariant: 'text' },
  { key: 'hasCompanyDemand', head: '企业诉求', filterVariant: 'text' },
  { key: 'isCompleted', head: '是否办结', filterVariant: 'text' },
  { key: 'problemDescription', head: '诉求描述', filterVariant: 'text' },
  { key: 'remarkInformation', head: '备注信息', filterVariant: 'text' },
  { key: 'completionTime', head: '办结时间', filterVariant: 'text' },
  { key: 'completionPersonName', head: '办结人姓名', filterVariant: 'text' },
  { key: 'completionRemark', head: '办结备注', filterVariant: 'text' },
];

export const COMP_COLUMNS: ColumnDef<SelectVisits>[] = compColumns.map((item) => ({
  accessorKey: item.key,
  header: () => <span>{item.head}</span>,
  meta: {
    filterKey: item.key,
    filterVariant: item.filterVariant,
  },
}));
