import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test15')({
  component: XX,
  loader: () => {
    // const visitDatas = await fetchVisitsDatas();
    // return { visitDatas, crumb: '历史走访记录' };
    return { crumb: '历史走访记录' };
  },
});

function XX() {
  return (
    <div>
      <h1>Test 15</h1>
      <p>This is a test route for testing purposes.</p>
    </div>
  );
}
