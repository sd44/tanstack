import { createFileRoute } from '@tanstack/react-router';
import { VisitsTableWrapper } from '~/lib/bazzaui/visits/visits-table';
import { getVisitsOpt } from '~/lib/db/CRUD/visit-datas';

export const Route = createFileRoute('/dashboard/history-visit')({
  loader: async ({ context: { queryClient } }) => {
    console.log('Before loading visit data...');
    const visitDatas = await queryClient.ensureQueryData(getVisitsOpt());
    console.log('Visit data loaded:', visitDatas.length);
    return { crumb: '历史走访记录', visitDatas };
  },

  errorComponent: ({ error }) => {
    // Render an error message
    return <div>{error.message}</div>;
  },
  component: VisitsTableWrapper,
});
