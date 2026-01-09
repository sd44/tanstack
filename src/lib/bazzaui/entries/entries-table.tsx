'use client';

import { type FiltersState, useDataTableFilters } from '@bazza-ui/filters';
import { createTSTColumns, createTSTFilters } from '@bazza-ui/filters/tanstack-table';
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
import { Filter } from '~/components/ui/filter';
import { getEntriesOpt } from '~/lib/db/CRUD/entry-datas';
import type { enterprisesSelectT } from '~/lib/db/schema';
import { DataTable } from '../data-table';
import { tstColumnDefs } from './columns';
import { columnsConfig } from './filters';

export function EntriesTableWrapper() {
  const [filters, setFilters] = useState<FiltersState>([]);
  return <EntriesTable state={{ filters, setFilters }} />;
}

function EntriesTable({
  state,
}: {
  state: {
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  };
}) {
  const { data } = useSuspenseQuery(getEntriesOpt());

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

  const table = useReactTable<enterprisesSelectT>({
    data,
    columns: tstColumns,
    // getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
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
        <Filter.Provider
          actions={actions}
          columns={columns}
          filters={filters}
          locale="zh_CN"
          strategy={strategy}
        >
          <Filter.Root>
            <Filter.Menu />
            <Filter.List>
              {({ filter, column }) => (
                <Filter.Item column={column} filter={filter}>
                  <Filter.Subject />
                  <Filter.Operator />
                  <Filter.Value />
                  <Filter.Remove />
                </Filter.Item>
              )}
            </Filter.List>
            <Filter.Actions />
          </Filter.Root>
        </Filter.Provider>
      </div>
      <DataTable table={table} />
    </div>
  );
}
