import { createCrudHooks, type IResourceItem } from '~/hooks/create-crud-hooks';
import { baseApi } from './base-api';

// 定义 Todo 类型，确保它符合 IResourceItem 接口
export interface Todo extends IResourceItem {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// ✨ 调用工厂函数，创建一套专门用于 'todos' 资源的 Hooks
// 我们使用别名来让 Hooks 的名字更具语义化
export const {
  queries: todoQueries,
  mutations: todoMutations,
  useGetList: useGetTodos,
  useGetById: useGetTodoById,
  useCreate: useCreateTodo,
  useUpdate: useUpdateTodo,
  useDelete: useDeleteTodo,
} = createCrudHooks<Todo, Omit<Todo, 'id'>, Partial<Todo> & { id: Todo['id'] }>({
  resourceKey: 'todos', // Query Key
  crudOperations: {
    getList: (filters) => baseApi.getList('todos', filters), // 传递 filters
    getById: (id) => baseApi.getById('todos', id),
    create: (payload) => baseApi.create('todos', payload),
    update: (payload) => baseApi.update('todos', payload),
    remove: (id) => baseApi.remove('todos', id),
  },
});
