import { createServerFn } from '@tanstack/react-start';
import { db } from '~/lib/server/db';
import { enterprises } from '~/lib/server/schema';
import { fetchDatas } from '~/lib/table/fetchdatas';
import { Filters, PaginatedData } from '~/lib/table/types';

export interface Comps {
  id: number;
  companyName: string;
  address: string;
  legalPersonName: string;
  legalPersonPhone: string;
  contactPerson: string;
  contactPersonPhone: string;
  companySize: string;
  registeredCapital: number;
  employeeCount: number;
  businessStatus: string;
  industryCategory: string;
  industryCode: string;
}

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
  key: string;
  head: string;
  filterVariant: string;
}

const compColumns: columnDefMeta[] = [
  { key: 'id', head: '序号', filterVariant: 'number' },
  { key: 'companyName', head: '企业名称', filterVariant: 'string' },
  { key: 'legalPersonName', head: '法代姓名', filterVariant: 'string' },
  { key: 'legalPersonPhone', head: '法代手机', filterVariant: 'string' },
  { key: 'contactPerson', head: '联系人姓名', filterVariant: 'string' },
  { key: 'contactPersonPhone', head: '联系人手机', filterVariant: 'string' },
  { key: 'companySize', head: '企业规模', filterVariant: 'string' },
  { key: 'registeredCapital', head: '注册资本 万元', filterVariant: 'number' },
  { key: 'employeeCount', head: '员工人数', filterVariant: 'number' },
  { key: 'businessStatus', head: '经营状态', filterVariant: 'string' },
  { key: 'industryCategory', head: '行业分类', filterVariant: 'string' },
];

export const COMP_COLUMNS: ColumnDef<Comps>[] = compColumns.map((item) => {
  return {
    accessorKey: item.key,
    header: () => <span>{item.head}</span>,
    meta: { filterKey: item.key, filterVariant: item.filterVariant },
  };
});
