import { createFileRoute } from '@tanstack/react-router';

import { BarChart02 } from '~/components/modif_shadcn/bar-chart';
function MyComponent() {
  // 使用 useRouteContext hook，并指定正确的上下文类型

  const { user } = Route.useLoaderData();
  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}

export const Route = createFileRoute('/test')({
  component: BarChart02,

  loader: ({ context }) => {
    return { user: context.user };
  },
});
