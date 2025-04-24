import { createFileRoute } from '@tanstack/react-router';
import { VisitForm } from '~/components/myui/visit-form';
import { fetchMyComps } from '~/lib/server/handle-visitors';

export const Route = createFileRoute('/test6')({
  component: xx,
  loader: async () => ({ comps: await fetchMyComps(), crum: '增加走访记录' }),
});

function xx() {
  /* return <VisitForm />; */
  return <div>{JSON.stringify(Route.useLoaderData().comps)}</div>;
}
