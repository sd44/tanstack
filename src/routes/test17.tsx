import { createFileRoute } from '@tanstack/react-router';

import { TodoList } from '~/lib/db/CRUD/todo-example/todo-lists';

export const Route = createFileRoute('/test17')({
  component: TodoList,
});
