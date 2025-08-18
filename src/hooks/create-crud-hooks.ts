import {
  mutationOptions,
  queryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// 定义所有资源都应具备的通用属性
export type IResourceItem = {
  id: string | number;
};

// CRUD 操作函数接口
export type CrudOperations<TSelect extends IResourceItem, TInsert, TUpdate> = {
  getList: (filters?: object) => Promise<TSelect[]>;
  getById: (id: string | number) => Promise<TSelect>;
  create: (payload: TInsert) => Promise<TSelect>;
  update: (payload: TUpdate) => Promise<TSelect>;
  remove: (id: string | number) => Promise<void>;
};

// 工厂函数的配置项
export type CrudHookFactoryConfig<TSelect extends IResourceItem, TInsert, TUpdate> = {
  /** 用于 queryKey 的唯一标识 (e.g., 'todos') */
  resourceKey: string;
  /** CRUD 操作函数 */
  crudOperations: CrudOperations<TSelect, TInsert, TUpdate>;
};

/**
 * 创建一套完整的 CRUD Hooks, queryOptions, 和 mutationOptions
 * @param TSelect 列表项或详情的类型
 * @param TInsert 创建时发送到 API 的数据类型
 * @param TUpdate 更新时发送到 API 的数据类型
 */
export function createCrudHooks<TSelect extends IResourceItem, TInsert, TUpdate>({
  resourceKey,
  crudOperations,
}: CrudHookFactoryConfig<TSelect, TInsert, TUpdate>) {
  /**
   * 标准化的、可复用的 Query Options 对象
   */
  const queries = {
    all: queryOptions({
      queryKey: [resourceKey],
    }),
    lists: () =>
      queryOptions({
        queryKey: [...queries.all.queryKey, 'list'],
        queryFn: () => crudOperations.getList(),
      }),
    list: (filters: object) =>
      queryOptions({
        queryKey: [...queries.lists().queryKey, JSON.stringify(filters)],
        queryFn: () => crudOperations.getList(filters),
      }),
    details: () =>
      queryOptions({
        queryKey: [...queries.all.queryKey, 'detail'],
      }),
    detail: (id: string | number) =>
      queryOptions({
        queryKey: [...queries.details().queryKey, id.toString()],
        queryFn: () => crudOperations.getById(id),
        enabled: !!id,
      }),
  };

  /**
   * 标准化的、可复用的 Mutation Options 对象
   */
  const mutations = {
    create: () =>
      mutationOptions({
        mutationFn: (newItem: TInsert) => crudOperations.create(newItem),
      }),
    update: () =>
      mutationOptions({
        mutationFn: (itemToUpdate: TUpdate) => crudOperations.update(itemToUpdate),
      }),
    remove: () =>
      mutationOptions({
        mutationFn: (id: string | number) => crudOperations.remove(id),
      }),
  };

  // --- HOOKS (现在 Query 和 Mutation 都基于 Options) ---

  const useGetList = (filters?: object): UseQueryResult<TSelect[], Error> => {
    const options = filters ? queries.list(filters) : queries.lists();
    return useQuery({ ...options });
  };

  const useGetById = (id: string | number): UseQueryResult<TSelect, Error> => {
    return useQuery(queries.detail(id));
  };

  // --- MUTATION HOOKS (现在消费 mutationOptions 并添加副作用) ---

  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      ...mutations.create(), // 复用 options
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queries.lists().queryKey });
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      ...mutations.update(), // 复用 options
      onSuccess: (updatedItem: TSelect) => {
        queryClient.invalidateQueries({ queryKey: queries.lists().queryKey });
        queryClient.invalidateQueries({
          queryKey: queries.detail(updatedItem.id).queryKey,
        });
      },
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      ...mutations.remove(), // 复用 options
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: queries.lists().queryKey });
        queryClient.removeQueries({ queryKey: queries.detail(id).queryKey });
      },
    });
  };

  return {
    queries,
    mutations,
    useGetList,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
  };
}
