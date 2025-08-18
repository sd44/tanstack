// import type { ColumnDef } from '@tanstack/react-table';
// import {
//   BadgeDollarSignIcon,
//   BlocksIcon,
//   Building2Icon,
//   LockKeyholeIcon,
//   LockOpenIcon,
//   TypeIcon,
//   User2Icon,
//   UserPenIcon,
// } from 'lucide-react';
// import { Checkbox } from '~/components/ui/checkbox';
// import type { enterprisesSelectT } from '~/lib/db/schema/enterprises.schema';
// import { filterFn } from '~/lib/filters';

// import { DataTableColumnHeader } from '../column-header';

// export const COMPS_COLUMNS: ColumnDef<enterprisesSelectT>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         aria-label="Select all"
//         checked={
//           table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => {
//           table.toggleAllRowsSelected(!!value);
//         }}
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         aria-label="Select row"
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => {
//           row.toggleSelected(!!value);
//         }}
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     id: 'rowIndex',
//     cell: (info) => <span>{info.row.index + 1}</span>,
//     header: ({ column }) => <DataTableColumnHeader column={column} title="序号" />,
//   },
//   {
//     accessorKey: 'companyName',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="企业名称" />,
//     meta: {
//       displayName: '企业名称',
//       type: 'text',
//       icon: Building2Icon,
//     },
//     filterFn: filterFn('text'),
//   },
//   {
//     accessorKey: 'legalPersonName',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="法定代表人" />,
//     meta: {
//       displayName: '法定代表人',
//       type: 'text',
//       icon: UserPenIcon,
//     },
//     filterFn: filterFn('text'),
//   },
//   {
//     accessorKey: 'legalPersonPhone',
//     header: () => <span>法定代表人手机</span>,
//   },
//   {
//     accessorKey: 'contactPerson',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="联系人" />,
//     meta: {
//       displayName: '联系人',
//       type: 'text',
//       icon: User2Icon,
//     },
//     filterFn: filterFn('text'),
//   },
//   {
//     accessorKey: 'contactPersonPhone',
//     header: () => <span>联系人手机</span>,
//   },
//   {
//     accessorKey: 'companySize',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="企业规模" />,
//     filterFn: filterFn('option'),
//     meta: {
//       displayName: '企业规模',
//       type: 'option',
//       icon: TypeIcon,
//       options: ['特大型', '大型', '中型', '小型', '微型'].map((item) => {
//         return { value: item, label: item, icon: undefined };
//       }),
//     },
//   },
//   {
//     accessorKey: 'registeredCapital',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="注册资本（万元）" />,
//     filterFn: filterFn('number'),
//     meta: {
//       displayName: '注册资本',
//       type: 'number',
//       icon: BadgeDollarSignIcon,
//       max: 1000,
//     },
//   },
//   {
//     accessorKey: 'employeeCount',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="员工人数" />,
//     filterFn: filterFn('number'),
//     meta: {
//       displayName: '员工人数',
//       type: 'number',
//       icon: User2Icon,
//       max: 1000,
//     },
//   },
//   {
//     accessorKey: 'businessStatus',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="经营状态" />,
//     filterFn: filterFn('option'),
//     meta: {
//       displayName: '经营状态',
//       type: 'option',
//       icon: TypeIcon,
//       options: [
//         { value: '正常', label: '正常', icon: LockOpenIcon },
//         { value: '异常', label: '异常', icon: LockKeyholeIcon },
//       ],
//     },
//   },
//   {
//     accessorKey: 'industryCategory',
//     header: ({ column }) => <DataTableColumnHeader column={column} title="行业分类" />,
//     filterFn: filterFn('text'),
//     meta: {
//       displayName: '行业分类',
//       type: 'text',
//       icon: BlocksIcon,
//     },
//   },
// ];
