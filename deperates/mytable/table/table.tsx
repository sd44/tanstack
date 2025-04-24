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
import { TooltipWrapper } from '~/components/myui/tooltip-wrapper';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'; // Adjust the import path based on your project structure
import { TooltipProvider } from '~/components/ui/tooltip';
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
export default function Table<T extends Record<string, any>>({
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
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                    style={{
                      width: header.getSize(),
                      minWidth: header.getSize(),
                      maxWidth: header.getSize(),
                    }}>
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
                            className="w-full rounded border shadow"
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
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}>
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
        <TooltipProvider>
          <TooltipWrapper tooltipMsg="首页">
            <Button
              className="rounded border"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}>
              {'<<'}
            </Button>
          </TooltipWrapper>

          <TooltipWrapper tooltipMsg="上一页">
            <Button
              className="rounded border"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              {'<'}
            </Button>
          </TooltipWrapper>

          <TooltipWrapper tooltipMsg="下一页">
            <Button
              className="rounded border"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              {'>'}
            </Button>
          </TooltipWrapper>

          <TooltipWrapper tooltipMsg="末页">
            <Button
              className="rounded border"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              {'>>'}
            </Button>
          </TooltipWrapper>
        </TooltipProvider>
        <span className="w-8" />
        <span>
          共<strong>{table.getPageCount()}</strong>页 ，跳转至第
          <DebouncedInput
            type="number"
            min={1}
            max={table.getPageCount()}
            className="data-[closed]:data-[leave]:opacit z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base font-bold shadow-lg ring-1 ring-black/5 focus:outline-none"
            value={table.getState().pagination.pageIndex + 1}
            onChange={(value) => {
              let page = value ? Number(value) - 1 : 0;
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
          共 <strong>{table.getRowCount()}</strong>条信息
        </span>
        <span className="w-16" />
        每页显示
        <Select
          // The 'value' prop expects a string. Convert the current pageSize number to string.
          value={table.getState().pagination.pageSize.toString()}
          // The 'onValueChange' callback receives the selected value as a string.
          onValueChange={(value) => {
            // Convert the selected string value back to a number before setting page size.
            table.setPageSize(Number(value));
          }}>
          {/* SelectTrigger is the button that opens the dropdown */}
          <SelectTrigger
            className="h-8 w-[70px]" // Example: Apply specific width/height if needed, Shadcn handles focus/base styles
          >
            {/* SelectValue displays the currently selected value */}
            <SelectValue placeholder="行数" /> {/* Optional: Add a placeholder */}
          </SelectTrigger>

          {/* SelectContent is the dropdown panel */}
          <SelectContent>
            {/* Map your page size options to SelectItem components */}
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem
                key={pageSize}
                // The 'value' prop for SelectItem must also be a string.
                value={pageSize.toString()}>
                {/* The content displayed for the option */}
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        条
      </div>
    </div>
  );
}
