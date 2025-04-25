'use client';

import { createFileRoute, useMatches } from '@tanstack/react-router';

export const Route = createFileRoute('/test2')({
  component: MyComponent,

  loader: ({ context }) => {
    return { user: context.user };
  },

  head: () => ({
    meta: [{ title: '测试2' }],
  }),
  staticData: {
    breadCrumb: '测试一下下',
  },
});

function MyComponent() {
  // 使用 useRouteContext hook，并指定正确的上下文类型

  const { user } = Route.useLoaderData();
  const matches = useMatches();
  console.log(matches.map((x) => x.fullPath));

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}
