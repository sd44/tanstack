import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { COMP_COLUMNS, fetchComps } from '~/components/myui/listcomp';
import Table, { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '~/lib/table/table';
import { sortByToState, stateToSortBy } from '~/lib/table/tableSortMapper';
import { useFilters } from '~/lib/table/useFilters';

export const Route = createFileRoute('/dashboard/ListCop')({
  component: ListComps,
  loader: () => ({
    crumb: '企业信息列表',
  }),
});

function ListComps() {
  const { filters, resetFilters, setFilters } = useFilters(Route.fullPath);

  const { data } = useQuery({
    queryKey: ['comps', filters],
    queryFn: () => fetchComps(filters),
    placeholderData: keepPreviousData,
  });

  const paginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
  };
  const sortingState = sortByToState(filters.sortBy);
  const columns = useMemo(() => COMP_COLUMNS, []);

  /* console.log(data); */

  return (
    <div className="mx-4 flex flex-col gap-2 overflow-auto p-2">
      <h3>企业信息列表</h3>
      <Table
        data={data?.result ?? []}
        columns={columns}
        pagination={paginationState}
        paginationOptions={{
          onPaginationChange: (pagination) => {
            setFilters(typeof pagination === 'function' ? pagination(paginationState) : pagination);
          },
          rowCount: data?.rowCount,
        }}
        filters={filters}
        onFilterChange={(filters) => {
          setFilters({ ...filters, pageIndex: DEFAULT_PAGE_INDEX });
        }}
        sorting={sortingState}
        onSortingChange={(updaterOrValue) => {
          const newSortingState =
            typeof updaterOrValue === 'function' ? updaterOrValue(sortingState) : updaterOrValue;
          return setFilters({ sortBy: stateToSortBy(newSortingState) });
        }}
      />
      <div className="flex items-center gap-2">
        {data?.rowCount} 获得数据
        <button
          className="rounded border p-1 disabled:cursor-not-allowed disabled:text-gray-500"
          onClick={resetFilters}
          disabled={Object.keys(filters).length === 0}>
          Reset Filters
        </button>
      </div>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
}
