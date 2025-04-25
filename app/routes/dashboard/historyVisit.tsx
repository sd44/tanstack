import { createFileRoute } from '@tanstack/react-router';

import { fetchVisitsDatas, VISIT_COLUMNS } from '~/lib/bazzaui/visits/visits-data';
import DataTable from '~/lib/bazzaui/data-table';

import { outputVisits } from '~/utils/visits-isomophic';

export const Route = createFileRoute('/dashboard/historyVisit')({
  component: RouteComponent,
  loader: async () => ({ visitsDatas: await fetchVisitsDatas(), crumb: '历史走访记录' }),
});

function RouteComponent() {
  const data = Route.useLoaderData().visitsDatas;
  console.log(data);
  return (
    <div className="mx-4 flex flex-col gap-2 overflow-auto p-2">
      <h3>历史走访记录</h3>
      <DataTable<outputVisits> data={data} columns={VISIT_COLUMNS} />
    </div>
  );
}
