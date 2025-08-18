import { createColumnHelper } from '@tanstack/react-table';
import { chineseSort } from '~/components/data-table-filter/lib/zh-cn-sorting';
import { Checkbox } from '~/components/ui/checkbox';
import type { enterprisesSelectT } from '~/lib/db/schema';

const columnHelper = createColumnHelper<enterprisesSelectT>();

export const tstColumnDefs = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  }),
  /* columnHelper.display({
   *   id: 'rowIndex',
   *   header: '序号',
   *   cell: (info) => <span>{info.row.index + 1}</span>,
   * }), */

  columnHelper.accessor((row) => row.id, {
    id: 'id',
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.companyName, {
    id: 'companyName',
    header: '企业名称',
    enableColumnFilter: true,
    cell: ({ row }) => <span>{row.original.companyName}</span>,
    sortingFn: chineseSort,
  }),
  columnHelper.accessor((row) => row.legalPersonName, {
    id: 'legalPersonName',
    header: '法定代表人',
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span> {row.original.legalPersonName}</span>;
    },
    sortingFn: chineseSort,
  }),
  columnHelper.accessor('legalPersonPhone', {
    id: 'legalPersonPhone',
    header: '法定代表人手机',
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span> {row.original.legalPersonPhone}</span>;
    },
  }),
  columnHelper.accessor((row) => row.companySize, {
    id: 'companySize',
    header: '企业规模',
    enableColumnFilter: true,
    cell: ({ row }) => <span>{row.original.companySize}</span>,
    sortingFn: chineseSort,
  }),

  columnHelper.accessor((row) => row.registeredCapital, {
    id: 'registerdCapital',
    header: '注册资本',
    cell: ({ row }) => {
      return <span>{row.original.registeredCapital}</span>;
    },
  }),
  columnHelper.accessor('employeeCount', {
    id: 'employeeCount',
    header: '员工人数',
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span>{row.original.employeeCount}</span>;
    },
  }),
  columnHelper.accessor((row) => row.businessStatus, {
    id: 'businessStatus',
    header: '经营状态',
    cell: ({ row }) => {
      return <span>{row.original.businessStatus}</span>;
    },
  }),
  columnHelper.accessor('industryCategory', {
    id: 'industryCategory',
    header: '行业分类',
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span>{row.original.industryCategory}</span>;
    },
  }),
];
