import { createFileRoute } from '@tanstack/react-router';
import { EntriesTableWrapper, getComps } from '../../lib/bazzaui/entries/entries-table';

export const Route = createFileRoute('/dashboard/list-cop')({
  loader: async ({ context: { queryClient } }) => {
    console.log('Before loading entries data...');
    const entriesData = await queryClient.ensureQueryData(getComps);
    console.log('Entries data loaded:', entriesData.length);

    return {
      crumb: '企业信息列表',
      entriesData,
    };
  },
  component: EntriesTableWrapper,

  errorComponent: ({ error }) => {
    // Render an error message
    return <div>{error.message}</div>;
  },
});
