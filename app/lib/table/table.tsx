import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  PaginationOptions,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { DebouncedInput } from '~/lib/table/debouncedInput';
import { Filters } from '~/lib/table/types';

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 20;

type Props<T extends Record<string, string | number>> = {
  data: T[];
  columns: ColumnDef<T>[];
  pagination: PaginationState;
  paginationOptions: Pick<PaginationOptions, 'onPaginationChange' | 'rowCount'>;
  filters: Filters<T>;
  onFilterChange: (dataFilters: Partial<T>) => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
};

// TODO: Record类型有限，只包括了string, number，应当泛型！
export default function Table<T extends Record<string, string | number>>({
  data,
  columns,
  pagination,
  paginationOptions,
  filters,
  onFilterChange,
  sorting,
  onSortingChange,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting },
    onSortingChange,
    ...paginationOptions,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-auto shadow ring-1 ring-black/5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const fieldMeta = header.column.columnDef.meta;
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-3 py-3.5 text-left text-sm font-semibold">
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                            false: ' 🔃',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() && fieldMeta?.filterKey !== undefined ? (
                          <DebouncedInput
                            className="w-16 rounded border shadow"
                            onChange={(value) => {
                              onFilterChange({
                                [fieldMeta.filterKey as keyof T]: value,
                              } as Partial<T>);
                            }}
                            placeholder="筛选…"
                            type={fieldMeta.filterVariant === 'number' ? 'number' : 'text'}
                            value={filters[fieldMeta.filterKey] ?? ''}
                          />
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="my-2 flex items-center gap-2">
        <button
          className="rounded border p-1 disabled:cursor-not-allowed disabled:text-gray-500"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button
          className="rounded border p-1 disabled:cursor-not-allowed disabled:text-gray-500"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <button
          className="rounded border p-1 disabled:cursor-not-allowed disabled:text-gray-500"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
        <button
          className="rounded border p-1 disabled:cursor-not-allowed disabled:text-gray-500"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}>
          {'>>'}
        </button>
        <span className="w-16"></span>
        <strong>共{table.getPageCount()}页</strong>
        <span className="flex items-center gap-1">
          ，跳转至第:
          <input
            type="number"
            min={1}
            max={table.getPageCount()}
            className="data-[closed]:data-[leave]:opacit z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base font-bold shadow-lg ring-1 ring-black/5 focus:outline-none"
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              let page = e.target.value ? Number(e.target.value) - 1 : 0;
              if (page >= table.getPageCount()) {
                page = table.getPageCount() - 1;
              }
              table.setPageIndex(page);
            }}
          />
          页
        </span>
        <span className="w-16" />
        <span className="flex items-center gap-1">
          <div>共</div>
          <strong>{table.getRowCount()}</strong>条信息
        </span>
        <span className="w-16" />
        每页显示
        <select
          className="data-[closed]:data-[leave]:opacit z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base font-bold shadow-lg ring-1 ring-black/5 focus:outline-none"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        条
      </div>
    </div>
  );
}
