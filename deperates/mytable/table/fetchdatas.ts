import { Filters, PaginatedData } from '~/lib/table/types';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 20;

/**
 * Represents a range filter with optional min and max values.
 */
export type RangeFilter = {
  min?: number;
  max?: number;
};

export async function fetchDatas<T extends Record<string, any>>(
  filtersAndPagination: Filters<T>,
  data: T[],
): Promise<PaginatedData<T>> {
  console.log('fetchDatas', filtersAndPagination);
  const {
    pageIndex = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy,
    ...filters
  } = filtersAndPagination;
  // 创建浅拷贝，只排序指针，防止修改原始数据，
  const requestedData = data.slice();

  if (sortBy) {
    const [field, order] = sortBy.split('.');
    requestedData.sort((a, b) => {
      const aValue = a[field as keyof T];
      const bValue = b[field as keyof T];

      if (aValue === bValue) return 0;
      if (order === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }

  const filteredData = requestedData.filter((item) => {
    return Object.keys(filters).every((key) => {
      const filter = filters[key];
      if (filter === undefined || filter === '') return true;

      const value = item[key as keyof T];

      if (typeof value === 'number') return value === +filter;

      if (typeof value === 'string') return value.toLowerCase().includes(`${filter}`.toLowerCase());
    });
  });

  return {
    result: filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    rowCount: filteredData.length,
  };
}
