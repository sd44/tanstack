import { type UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 定义所有资源都应具备的通用属性
export interface IResourceItem {
  id: string | number;
}

// CRUD 操作函数接口
export interface CrudOperations<TSelect extends IResourceItem, TInsert, TUpdate> {
  getList: () => Promise<TSelect[]>;
  getById: (id: string | number) => Promise<TSelect>;
  create: (payload: TInsert) => Promise<TSelect>;
  update: (payload: TUpdate) => Promise<TSelect>;
  remove: (id: string | number) => Promise<void>;
}

// 工厂函数的配置项
export interface CrudHookFactoryConfig<TSelect extends IResourceItem, TInsert, TUpdate> {
  /** 用于 queryKey 的唯一标识 (e.g., 'todos') */
  resourceKey: string;
  /** CRUD 操作函数 */
  crudOperations: CrudOperations<TSelect, TInsert, TUpdate>;
}

/**
 * 创建一套完整的 CRUD Hooks
 * @param TItem 列表项或详情的类型
 * @param TCreatePayload 创建时发送到 API 的数据类型
 * @param TUpdatePayload 更新时发送到 API 的数据类型
 */
export function createCrudHooks<TSelect extends IResourceItem, TInsert, TUpdate>({
  resourceKey,
  crudOperations,
}: CrudHookFactoryConfig<TSelect, TInsert, TUpdate>) {
  /**
   * 标准化的 Query Keys 结构，便于管理缓存
   */
  const queryKeys = {
    all: [resourceKey] as const,
    lists: () => [...queryKeys.all, 'list'] as const,
    list: (filters: object) => [...queryKeys.lists(), filters] as const,
    details: () => [...queryKeys.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.details(), id.toString()] as const,
  };

  // --- HOOKS ---

  /**
   * 获取资源列表的 Hook
   * @param filters - 查询参数/过滤器对象
   */
  const useGetList = (): UseQueryResult<TSelect[], Error> => {
    return useQuery({
      queryKey: queryKeys.lists(),
      queryFn: () => crudOperations.getList(),
    });
  };

  /**
   * 根据 ID 获取单个资源的 Hook
   * @param id - 资源的 ID
   */
  const useGetById = (id: string | number): UseQueryResult<TSelect, Error> => {
    return useQuery({
      queryKey: queryKeys.detail(id),
      queryFn: () => crudOperations.getById(id),
      enabled: !!id, // 只有在 id 存在时才执行查询
    });
  };

  /**
   * 创建新资源的 Hook
   */
  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (newItem: TInsert) => crudOperations.create(newItem),
      onSuccess: () => {
        // 创建成功后，让所有与此资源相关的列表查询失效，以便自动重新获取最新数据
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      },
    });
  };

  /**
   * 更新现有资源的 Hook
   */
  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (itemToUpdate: TUpdate) => crudOperations.update(itemToUpdate),
      onSuccess: (updatedItem: TSelect) => {
        // 更新成功后，让列表和对应的详情查询失效
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: queryKeys.detail(updatedItem.id),
        });

        // 也可以使用 setQueryData 进行乐观更新或直接更新缓存，以获得更好的用户体验
        // queryClient.setQueryData(queryKeys.detail(updatedItem.id), updatedItem);
      },
    });
  };

  /**
   * 删除资源的 Hook
   */
  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string | number) => crudOperations.remove(id),
      onSuccess: (_, id) => {
        // 删除成功后，让列表查询失效
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        // 也可以直接从缓存中移除该项的详情查询
        queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
      },
    });
  };

  return {
    queryKeys,
    useGetList,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
  };
}
