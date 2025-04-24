import { createServerFn } from '@tanstack/react-start';
import { ColumnDef } from '@tanstack/react-table';
import { db } from '~/lib/server/db';
import { enterprises, visits } from '~/lib/server/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import { getUser } from '~/lib/server/getuser';
import { outputVisits } from '~/utils/visits-isomophic';
import { filterFn } from '~/lib/filters';
import {
  BatteryChargingIcon,
  BatteryFullIcon,
  CalendarArrowUpIcon,
  FootprintsIcon,
  Building2Icon,
  ListChecksIcon,
  PhoneCallIcon,
  UserPenIcon,
  VideoIcon,
  TypeIcon,
  SpeechIcon,
  SendToBackIcon,
} from 'lucide-react';
import { Checkbox } from '~/components/ui/checkbox';

import { DataTableColumnHeader } from '../column-header';

export const fetchVisitsDatas = createServerFn({ method: 'GET' }).handler(async () => {
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
    .where(inArray(visits.companyName, myCompsSubquery))
    .orderBy(desc(visits.visitTime));

  // <-- 直接传递子查询

  console.log('数据条数: ', results.length);
  return results;
});

export const VISIT_COLUMNS: ColumnDef<outputVisits>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => {
          table.toggleAllRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'rowIndex',
    cell: (info) => <span>{info.row.index + 1}</span>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="序号" />,
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="企业名称" />,
    meta: {
      displayName: '企业名称',
      type: 'text',
      icon: Building2Icon,
    },
    filterFn: filterFn('text'),
  },
  {
    id: 'visitTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title="走访时间" />,
    accessorFn: (row) =>
      row.visitTime.toLocaleDateString('zh-CN') + ' ' + row.visitTime.toLocaleTimeString('zh-CN'),
    meta: {
      displayName: '走访时间',
      type: 'date',
      icon: CalendarArrowUpIcon,
    },
    filterFn: filterFn('date'),
  },
  {
    accessorKey: 'visitType',
    header: ({ column }) => <DataTableColumnHeader column={column} title="走访类型" />,
    filterFn: filterFn('option'),
    meta: {
      displayName: '走访类型',
      type: 'option',
      icon: TypeIcon,
      options: [
        { value: '实地走访', label: '实地走访', icon: FootprintsIcon },
        { value: '电话联系', label: '电话联系', icon: PhoneCallIcon },
        { value: '微信交流', label: '微信交流', icon: VideoIcon },
      ],
    },
  },
  {
    accessorKey: 'visitedPerson',
    header: () => <span>被走访人</span>,
    meta: {
      displayName: '被走访人',
      type: 'text',
      icon: UserPenIcon,
    },
    filterFn: filterFn('text'),
  },
  {
    accessorKey: 'visitedPersonPosition',
    header: () => <span>被走访人职务</span>,
  },
  {
    id: 'hasCompanyDemand',
    header: ({ column }) => <DataTableColumnHeader column={column} title="企业诉求" />,
    accessorFn: (row) => (row.hasCompanyDemand ? '有' : '无'),
    filterFn: filterFn('option'),
    meta: {
      displayName: '企业诉求',
      type: 'option',
      icon: SpeechIcon,
      options: [
        { value: '有', label: '有诉求', icon: BatteryChargingIcon },
        { value: '无', label: '无诉求', icon: BatteryFullIcon },
      ],
    },
  },
  {
    id: 'isCompleted',
    accessorFn: (row) => (row.isCompleted ? '是' : '否'),
    header: () => <span>是否办结</span>,
    filterFn: filterFn('option'),
    meta: {
      displayName: '是否办结',
      type: 'option',
      icon: SendToBackIcon,
      options: [
        { value: '是', label: '已办结', icon: BatteryChargingIcon },
        { value: '否', label: '未办结', icon: BatteryFullIcon },
      ],
    },
  },
  {
    accessorKey: 'completedDescription',
    header: () => <span>办结描述</span>,
    cell: (info) => (
      <div className="w-80 text-wrap">{info.getValue<string | undefined | null>()}</div>
    ),
  },
  {
    id: 'completionTime',
    accessorFn: (row) =>
      row.completionTime
        ? row.completionTime.toLocaleDateString('zh-CN') +
          ' ' +
          row.completionTime.toLocaleTimeString('zh-CN')
        : '',
    header: ({ column }) => <DataTableColumnHeader column={column} title="办结时间" />,
    meta: {
      displayName: '办结时间',
      type: 'date',
      icon: CalendarArrowUpIcon,
    },
    filterFn: filterFn('date'),
  },
  {
    accessorKey: 'completionPersonName',
    header: () => <span>办结人</span>,
    meta: {
      displayName: '办结人',
      type: 'text',
      icon: ListChecksIcon,
    },
    filterFn: filterFn('text'),
  },
];
