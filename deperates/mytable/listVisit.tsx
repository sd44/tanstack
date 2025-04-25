import { createServerFn } from '@tanstack/react-start';
import { ColumnDef } from '@tanstack/react-table';
import { db } from '~/lib/server/db';
import { SelectVisits, visits, enterprises } from '~/lib/server/schema';
import { fetchDatas } from '~/lib/table/fetchdatas';
import { Filters, PaginatedData } from '~/lib/table/types';
import { eq, inArray } from 'drizzle-orm';
import { getUser } from '~/lib/server/getuser';
import { outputVisits } from '~/utils/visits-isomophic';

export const fetchVisitsDatas = createServerFn({ method: 'GET' }).handler(async () => {
  // 模拟 user，在实际应用中替换为真实用户
  const user = await getUser();
  const userId = user?.id;
  console.log('userId is: ', userId);
  if (!userId) {
    throw new Error('userId不存在');
  }

  // 1. 构建子查询，注意这里 *不* 加 await，与下方where形成JOIN查询
  const myCompsSubquery = db
    .select({ data: enterprises.companyName }) // <--- 选择需要用于 IN 条件的列
    .from(enterprises)
    .where(eq(enterprises.servicerId, userId));

  // 2. 将子查询直接传递给 inArray
  // Drizzle 会生成类似 "... WHERE visits.companyName IN (SELECT enterprises.companyName FROM enterprises WHERE ...)" 的 SQL
  const results = await db
    .select()
    .from(visits)
    .where(inArray(visits.companyName, myCompsSubquery));
  // <-- 直接传递子查询

  console.log('数据条数: ', results.length);
  return results;
});

export type VisitFilters = Filters<SelectVisits>;

export async function fetchVisits(
  filtersAndPagination: VisitFilters,
): Promise<PaginatedData<SelectVisits>> {
  try {
    const datas = await fetchVisitsDatas();

    console.log(datas);
    console.log('fetchVisits', filtersAndPagination);
    return await fetchDatas(filtersAndPagination, datas);
  } catch (err) {
    console.error('错误啦\n\n\n');
    console.error(err);
    throw err;
  }
}

export const VISIT_COLUMNS: ColumnDef<outputVisits>[] = [
  {
    id: 'rowIndex',
    cell: (info) => <span>{info.row.index + 1}</span>,
    header: () => <span>序号</span>,
    meta: {},
    size: 70,
  },
  {
    accessorKey: 'companyName',
    header: () => <span>企业名称</span>,
    meta: {
      filterKey: 'companyName',
      filterVariant: 'text',
    },
    size: 300,
  },
  {
    id: 'visitTime',
    header: () => <span>走访时间</span>,
    accessorFn: (row) =>
      row.visitTime.toLocaleDateString('zh-CN') + ' ' + row.visitTime.toLocaleTimeString('zh-CN'),
    filterFn: 'includesString',
    meta: {
      filterVariant: 'text',
    },
    size: 200,
  },
  {
    accessorKey: 'visitType',
    header: () => <span>走访类型</span>,
    meta: {
      filterKey: 'visitType',
      filterVariant: 'text',
    },
    size: 120,
  },
  {
    accessorKey: 'visitedPerson',
    header: () => <span>被走访人</span>,
    meta: {
      filterKey: 'visitedPerson',
      filterVariant: 'text',
    },
    size: 120,
  },
  {
    accessorKey: 'visitedPersonPosition',
    header: () => <span>走访人职务</span>,
    meta: {
      filterKey: 'visitedPersonPosition',
      filterVariant: 'text',
    },
  },
  {
    id: 'hasCompanyDemand',
    header: () => <span>有企业诉求</span>,
    accessorFn: (row) => (row.hasCompanyDemand ? '是' : '否'),
    filterFn: 'includesString',
    meta: {
      filterVariant: 'text', // 注意：如果数据是布尔值，筛选器可能需要调整
    },
    size: 120,
  },
  {
    id: 'isCompleted',
    accessorFn: (row) => (row.isCompleted ? '是' : '否'),
    filterFn: 'includesString',
    header: () => <span>是否办结</span>,
    meta: {
      filterVariant: 'text', // 注意：如果数据是布尔值，筛选器可能需要调整
    },
    size: 120,
  },
  {
    accessorKey: 'completedDescription',
    header: () => <span>办结描述</span>,
    meta: {
      filterKey: 'completedDescription',
      filterVariant: 'text',
    },
    size: 400,
  },
  {
    id: 'completionTime',
    accessorFn: (row) =>
      row.completionTime
        ? row.completionTime.toLocaleDateString('zh-CN') +
          ' ' +
          row.completionTime.toLocaleTimeString('zh-CN')
        : '',
    header: () => <span>办结时间</span>,
    meta: {
      filterKey: 'completionTime',
      filterVariant: 'text',
    },
    size: 200,
  },
  {
    accessorKey: 'completionPersonName',
    header: () => <span>办结人姓名</span>,
    meta: {
      filterKey: 'completionPersonName',
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'completionRemark',
    header: () => <span>办结备注</span>,
    meta: {
      filterKey: 'completionRemark',
      filterVariant: 'text',
    },
  },
];
