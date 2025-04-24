import { useState } from 'react';
import {
  type ColumnDef, // 引入列定义类型
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table, // 引入 Table 类型
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import DataTableWrapper from './data-table-wrapper';
// 移除特定的 data 和 columns 导入
// import { columns } from './columns';
// import { ISSUES } from './data';
// import { fuzzyFilter } from '@/lib/filters'

// 1. 定义 Props 接口，使用泛型 TData
interface DataTableProps<TData> {
  data: TData[]; // 数据是 TData 类型的数组
  columns: ColumnDef<TData, any>[]; // 列定义，其泛型参数 TData 对应数据类型
  // 可以添加其他需要的 props，例如初始状态等
}

// 2. 为组件添加泛型参数 TData，并接收 props
export default function DataTable<TData>({ data, columns }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // useReactTable 会根据传入的 data 和 columns 推断出 TData
  // 或者你可以显式指定: useReactTable<TData>({...})
  const table = useReactTable({
    data, // 3. 使用 props 传入的 data
    columns, // 4. 使用 props 传入的 columns
    // --- 其他配置保持不变 ---
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      // fuzzy: fuzzyFilter, // 如果需要，确保 filter 函数是通用的或也作为 prop 传入
    },
    // debugTable: true, // 可选：用于调试
  });

  // 5. 传递 table 实例给 DataTableWrapper
  // 注意：DataTableWrapper 可能也需要调整以正确处理泛型 Table<TData> 实例
  // 如果 DataTableWrapper 内部没有强依赖 TData 的具体结构，可能无需修改
  return <DataTableWrapper table={table as Table<TData>} />; // 可以显式转换类型以确保类型安全
}
