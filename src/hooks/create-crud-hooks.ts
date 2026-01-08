/**
 * @fileoverview
 * 本文件提供了一个工厂函数, 用于为 CRUD (创建、读取、更新、删除) 操作创建一套标准的 TanStack Query hooks.
 *
 * 它被设计为与 TanStack Start 的 Server Functions 一起使用.
 * 您传递给 `createCrudHooks` 的 `crudOperations` 对象应包含在带有 `'use server'` 指令的文件中定义的函数.
 * 这些 server functions 将在服务器上执行, 而 hooks 本身在客户端使用.
 *
 * @example
 * // 1. 定义您的 server functions (例如, 在 `src/lib/server/todos.ts` 中)
 * 'use server'
 *
 * export async function getList(filters?: object) {
 *   // 您的数据库逻辑...
 *   console.log('在服务器上根据筛选条件获取 todos:', filters);
 *   return [{ id: 1, text: 'Buy milk' }];
 * }
 *
 * export async function create(newTodo: { text: string }) {
 *   // 您的数据库逻辑...
 *   console.log('在服务器上创建 todo:', newTodo);
 *   return { id: 2, ...newTodo };
 * }
 * // ... 实现 getById, update, remove
 *
 * // 2. 使用工厂函数创建您的特定 hooks (例如, 在 `src/hooks/use-todos.ts` 中)
 * import { createCrudHooks } from '@/hooks/create-crud-hooks';
 * import * as todoOperations from '@/lib/server/todos';
 *
 * export const { useGetList, useCreate, ... } = createCrudHooks({
 *   resourceKey: 'todos',
 *   crudOperations: todoOperations,
 * });
 *
 * // 3. 在您的客户端组件中使用生成的 hooks
 * function TodoListComponent() {
 *   const { data: todos } = useGetList();
 *   // ...
 * }
 */
import {
  mutationOptions,
  queryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// 定义所有资源都应具备的通用属性
export interface IResourceItem {
  id: string | number;
}

// CRUD 操作函数接口
export interface CrudOperations<TSelect extends IResourceItem, TInsert, TUpdate> {
  getList: (filters?: object) => Promise<TSelect[]>;
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
