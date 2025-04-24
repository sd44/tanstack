import { createFileRoute } from '@tanstack/react-router';

import { fetchCompDatas, COMPS_COLUMNS } from '~/lib/bazzaui/comps/comps-data';
import DataTable from '~/lib/bazzaui/data-table';

export const Route = createFileRoute('/dashboard/ListCop')({
  component: RouteComponent,
  loader: async () => ({
    compsData: await fetchCompDatas(),
    crumb: '企业信息列表',
  }),
});

function RouteComponent() {
  const compsData = Route.useLoaderData().compsData;
  return (
    <div className="mx-4 flex flex-col gap-2 overflow-auto p-2">
      <h3>企业信息列表</h3>
      <DataTable data={compsData} columns={COMPS_COLUMNS} />
    </div>
  );
}
