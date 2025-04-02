'use client';

import { createFileRoute } from '@tanstack/react-router';
import { PieChartSelector } from '~/components/modif_shadcn/pie-chart';

function MyComponent() {
  // 使用 useRouteContext hook，并指定正确的上下文类型

  const { user } = Route.useLoaderData();
  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}

export const Route = createFileRoute('/test2')({
  component: PieChartSelector,

  loader: ({ context }) => {
    return { user: context.user };
  },
});
