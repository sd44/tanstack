import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test6')({
  component: XX,
});

function XX() {
  return <div>test6</div>;
}
