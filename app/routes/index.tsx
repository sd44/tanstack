import { createFileRoute } from '@tanstack/react-router';
import { About } from '~/components/about';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return <About />;
}
