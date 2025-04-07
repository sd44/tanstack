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

      if (typeof value === 'number') return value.toString().includes(filter);

      if (typeof value === 'string') return value.toLowerCase().includes(`${filter}`.toLowerCase());

      if (typeof filter === 'object' && filter !== null && ('min' in filter || 'max' in filter)) {
        // This filter only makes sense for numeric values
        if (typeof value !== 'number') {
          // Decide how to handle non-numeric values for a range filter:
          // Option A: Ignore the filter for this item (return true)
          // Option B: Fail the item if the types don't match (return false)
          console.warn(
            `Range filter applied to non-numeric value for key "${key}". Skipping filter for this item.`,
          );
          return true; // Let's go with Option A for flexibility
        }

        const rangeFilter = filter as RangeFilter;
        let minPass = true;
        let maxPass = true;

        if (rangeFilter.min !== undefined && rangeFilter.min !== null) {
          minPass = value >= rangeFilter.min;
        }
        if (rangeFilter.max !== undefined && rangeFilter.max !== null) {
          maxPass = value <= rangeFilter.max;
        }
        // The item passes if it meets both min and max conditions (if they are defined)
        return minPass && maxPass;
      }

      // If filterConfig is an object but not a RangeFilter (e.g., empty object {}), treat as pass?
      // Or handle other potential object-based filters in the future.
      console.warn(`Unhandled filter type for key "${key}":`, filter);
      return true; // Default to pass for unhandled types for now
    });
  });

  return {
    result: filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    rowCount: filteredData.length,
  };
}
