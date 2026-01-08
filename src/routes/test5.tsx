import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test5')({
  component: Component,
  loader: () => {
    return { message: 'Data loaded' };
  },
});

function Component() {
  return (
    <div>
      <h1>Test Route 5</h1>
      <p>This is a test route.</p>
    </div>
  );
}
