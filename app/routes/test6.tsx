import { createFileRoute } from '@tanstack/react-router';
import { VisitForm } from '~/components/myui/visit-form';

export const Route = createFileRoute('/test6')({
  component: xx,
});

function xx() {
  return <VisitForm />;
}
