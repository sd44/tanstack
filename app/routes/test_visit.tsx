import { createFileRoute } from '@tanstack/react-router';

import { fetchVisitsDatas, VISIT_COLUMNS } from '~/lib/bazzaui/visits/visits-data';
import DataTable from '~/lib/bazzaui/data-table';

import { outputVisits } from '~/utils/visits-isomophic';

export const Route = createFileRoute('/test_visit')({
  component: RouteComponent,
  loader: async () => ({ visitsDatas: await fetchVisitsDatas(), crumb: '历史走访记录' }),
});

function RouteComponent() {
  const data = Route.useLoaderData().visitsDatas;
  console.log(data);
  return (
    <div>
      <DataTable<outputVisits> data={data} columns={VISIT_COLUMNS} />
    </div>
  );
}
