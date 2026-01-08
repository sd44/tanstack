'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { chineseSort } from '~/components/data-table-filter/lib/zh-cn-sorting';
import { Checkbox } from '~/components/ui/checkbox';
import type { visitSelectT } from '~/lib/db/schema';

const columnHelper = createColumnHelper<visitSelectT>();

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
  columnHelper.accessor((row) => row.visitTime, {
    id: 'visitTime',
    header: '走访时间',
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span> {row.original.visitTime.toLocaleString('zh-CN')}</span>;
    },
  }),
  columnHelper.accessor('visitType', {
    id: 'visitType',
    header: '走访类型',
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const visitType = getValue();
      return <span>{visitType}</span>;
    },
  }),
  columnHelper.accessor((row) => row.visitedPerson, {
    id: 'visitedPerson',
    header: '被走访人',
    enableColumnFilter: true,
    cell: ({ row }) => <span>{row.original.visitedPerson}</span>,
    sortingFn: chineseSort,
  }),

  columnHelper.accessor((row) => row.visitedPersonPosition, {
    id: 'visitedPersonPosition',
    header: '被走访人职务',
    cell: ({ row }) => {
      return <span>{row.original.visitedPersonPosition}</span>;
    },
    sortingFn: chineseSort,
  }),
  columnHelper.accessor('hasCompanyDemand', {
    id: 'hasCompanyDemand',
    header: '企业诉求',
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      return <span>{getValue() ? '有' : '无'}</span>;
    },
    sortingFn: chineseSort,
  }),
  columnHelper.accessor((row) => row.visitSituation, {
    id: 'visitSituation',
    header: '走访情况',
    cell: ({ row }) => {
      return <span>{row.original.visitSituation}</span>;
    },
  }),
  columnHelper.accessor('isCompleted', {
    id: 'isCompleted',
    header: '是否办结',
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      return <span>{getValue() ? '是' : '否'}</span>;
    },
  }),

  columnHelper.accessor((row) => row.completedDescription, {
    id: 'completedDescription',
    header: '办结描述',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return <div className="w-80 text-wrap">{row.original.completedDescription}</div>;
    },
    sortingFn: chineseSort,
  }),

  columnHelper.accessor((row) => row.completionTime, {
    id: 'completionTime',
    header: '办结时间',
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span>{row.original.completionTime?.toLocaleString('zh-CN')}</span>;
    },
  }),

  columnHelper.accessor((row) => row.completionPersonName, {
    id: 'completionPersonName',
    header: '办结人',
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <span>{row.original.completionPersonName}</span>;
    },
    sortingFn: chineseSort,
  }),
];
