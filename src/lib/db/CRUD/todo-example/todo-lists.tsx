import { type Todo, useCreateTodo, useDeleteTodo, useGetTodos } from './todo-hooks';

export function TodoList() {
  // 1. 获取数据
  const { data: todos, isLoading, isError, error } = useGetTodos(); // 可以传入查询参数

  // 2. 获取 mutations
  const createTodoMutation = useCreateTodo();
  const deleteTodoMutation = useDeleteTodo();

  // 3. 定义事件处理器
  const handleAddTodo = () => {
    const newTodo = {
      title: `A new awesome todo ${Date.now()}`,
      completed: false,
      userId: 1,
    };
    createTodoMutation.mutate(newTodo);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  // 4. 渲染 UI
  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>发生错误: {error.message}</div>;

  return (
    <div>
      <h2>Todo 列表</h2>
      <button disabled={createTodoMutation.isPending} onClick={handleAddTodo} type="button">
        {createTodoMutation.isPending ? '添加中...' : '添加 Todo'}
      </button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos?.map((todo: Todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '0.5rem 0',
            }}
          >
            <span>{todo.title}</span>
            <button
              disabled={deleteTodoMutation.isPending && deleteTodoMutation.variables === todo.id}
              onClick={() => handleDeleteTodo(todo.id)}
              type="button"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
