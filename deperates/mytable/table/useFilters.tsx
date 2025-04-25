import { getRouteApi, RegisteredRouter, RouteIds, useNavigate } from '@tanstack/react-router';
import { cleanEmptyParams } from '~/lib/table/cleanEmptyParams';
import { RowData } from '@tanstack/react-table';

// TODO: 实现filterVariant，目前只有text和number
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: 'text' | 'number' | 'date' | 'range' | 'select';
  }
}

export function useFilters<T extends RouteIds<RegisteredRouter['routeTree']>>(routeId: T) {
  const routeApi = getRouteApi<T>(routeId);
  const navigate = useNavigate();
  const filters = routeApi.useSearch();

  const setFilters = (partialFilters: Partial<typeof filters>) =>
    navigate({
      search: (prev) => cleanEmptyParams({ ...prev, ...partialFilters }),
    });
  const resetFilters = () => navigate({ search: {} });

  return { filters, setFilters, resetFilters };
}
