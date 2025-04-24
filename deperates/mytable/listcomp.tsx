import { createServerFn } from '@tanstack/react-start';
import { ColumnDef } from '@tanstack/react-table';
import { db } from '~/lib/server/db';
import { SelectEnterprises as Comps, enterprises } from '~/lib/server/schema';
import { fetchDatas } from '~/lib/table/fetchdatas';
import { Filters, PaginatedData } from '~/lib/table/types';

const fetchCompDatas = createServerFn({ method: 'GET' }).handler(async () => {
  const result = await db.select().from(enterprises);
  const datas = result.map((item, index) => {
    return {
      ...item,
      id: index + 1,
    };
  });
  console.log('数据条数: ', datas.length);
  return datas;
});

export type CompFilters = Filters<Comps>;

export async function fetchComps(filtersAndPagination: CompFilters): Promise<PaginatedData<Comps>> {
  try {
    const datas = await fetchCompDatas();

    console.log(datas);
    console.log('fetchComps', filtersAndPagination);
    return fetchDatas(filtersAndPagination, datas);
  } catch (err) {
    console.error('错误啦\n\n\n');
    console.error(err);
    throw err;
  }
}

interface columnDefMeta {
  key: keyof Comps;
  head: string;
  filterVariant?: 'text' | 'number';
  size?: number;
}

const compColumns: columnDefMeta[] = [
  { key: 'id', head: '序号', filterVariant: 'number', size: 80 },
  { key: 'companyName', head: '企业名称', filterVariant: 'text', size: 220 },
  { key: 'legalPersonName', head: '法定代表人姓名', filterVariant: 'text', size: 120 },
  { key: 'legalPersonPhone', head: '法代手机', filterVariant: 'text' },
  { key: 'contactPerson', head: '联系人姓名', filterVariant: 'text' },
  { key: 'contactPersonPhone', head: '联系人手机', filterVariant: 'text' },
  { key: 'companySize', head: '企业规模', filterVariant: 'text', size: 100 },
  {
    key: 'registeredCapital',
    head: '注册资本\n万元',
    filterVariant: 'number',
    size: 130,
  },
  { key: 'employeeCount', head: '员工人数', filterVariant: 'number', size: 100 },
  { key: 'businessStatus', head: '经营状态', filterVariant: 'text', size: 100 },
  { key: 'industryCategory', head: '行业分类', filterVariant: 'text', size: 100 },
];

export const COMP_COLUMNS: ColumnDef<Comps>[] = compColumns.map((item) => ({
  accessorKey: item.key,
  header: () => <span>{item.head}</span>,
  meta: {
    filterKey: item.key,
    filterVariant: item.filterVariant,
  },
  size: item.size,
}));
