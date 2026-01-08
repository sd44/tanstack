'use client';

import { type FiltersState, useDataTableFilters } from '@bazzaui/filters';
import { createTSTColumns, createTSTFilters } from '@bazzaui/filters/tanstack-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DataTableFilter } from '~/components/data-table-filter';
import { getVisitsOpt } from '~/lib/db/CRUD/visit-datas';
import type { visitSelectT } from '~/lib/db/schema';
import { DataTable } from '../data-table';
import { tstColumnDefs } from './columns';
import { columnsConfig } from './filters';

export function VisitsTableWrapper() {
  const [filters, setFilters] = useState<FiltersState>([]);
  return <VisitsTable state={{ filters, setFilters }} />;
}
function VisitsTable({
  state,
}: {
  state: {
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  };
}) {
  const { data } = useSuspenseQuery(getVisitsOpt());

  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: 'client',
    data,
    columnsConfig,
    filters: state.filters,
    onFiltersChange: state.setFilters,
  });

  // Step 4: Extend our TanStack Table columns with custom filter functions (and more!)
  //         using our integration hook.
  const tstColumns = useMemo(
    () =>
      createTSTColumns({
        columns: tstColumnDefs,
        configs: columns,
      }),
    [columns],
  );

  const tstFilters = useMemo(() => createTSTFilters(filters), [filters]);
  // Step 5: Create our TanStack Table instance
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]); // can set initial sorting state here

  const table = useReactTable<visitSelectT>({
    data,
    columns: tstColumns,
    // getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    // 客户端排序 https://tanstack.com.cn/table/latest/docs/guide/sorting
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
    state: {
      rowSelection,
      columnFilters: tstFilters,
      sorting,
    },
    onSortingChange: setSorting,
  });
  // Step 6: Render the table!
  return (
    <div className="col-span-2 w-full">
      <div className="flex items-center gap-2 pb-4">
        <DataTableFilter
          actions={actions}
          columns={columns}
          filters={filters}
          locale="zh_CN"
          strategy={strategy}
        />
      </div>
      <DataTable table={table} />
    </div>
  );
}
