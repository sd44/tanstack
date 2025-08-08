import { createFileRoute } from '@tanstack/react-router';
import { getVisits, VisitsTableWrapper } from '~/lib/bazzaui/visits/visits-table';

export const Route = createFileRoute('/dashboard/history-visit')({
  loader: async ({ context: { queryClient } }) => {
    console.log('Before loading visit data...');
    const visitDatas = await queryClient.ensureQueryData(getVisits);
    console.log('Visit data loaded:', visitDatas.length);
    return { crumb: '历史走访记录', visitDatas };
  },

  errorComponent: ({ error }) => {
    // Render an error message
    return <div>{error.message}</div>;
  },
  component: VisitsTableWrapper,
});
