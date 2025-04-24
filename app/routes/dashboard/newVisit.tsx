import { createFileRoute } from '@tanstack/react-router';

import { VisitForm } from '~/components/myui/visit-form';
import { fetchMyComps } from '~/lib/server/handle-visitors';

export const Route = createFileRoute('/dashboard/newVisit')({
  component: RouteComponent,
  loader: async () => ({ comps: await fetchMyComps(), crumb: '增加走访记录' }),
});

function RouteComponent() {
  return (
    <div className="mx-4 flex flex-col gap-2 overflow-auto p-2">
      <h3>新增企业信息</h3>
      <VisitForm comps={Route.useLoaderData().comps} />;
    </div>
  );
}
