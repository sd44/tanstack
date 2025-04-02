import { Link, createFileRoute, useRouter } from '@tanstack/react-router';
import ThemeToggle from '~/components/ThemeToggle';
import { Button } from '~/components/ui/button';
import authClient from '~/lib/utils/auth-client';

import * as Sentry from '@sentry/react';

export const Route = createFileRoute('/deperates/')({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  Sentry.init({
    dsn: 'https://ff02151b444e016c2d49c208d2579e25@o4508956192800768.ingest.us.sentry.io/4508956197322752',
    integrations: [Sentry.browserTracingIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  });

  const { queryClient } = Route.useRouteContext();
  const { user } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">TanStarter</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="rounded-md border bg-card p-1 text-card-foreground">routes/index.tsx</pre>
      </div>

      {user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {user.name}!</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <div>
            More data:
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>

          <Button
            onClick={async () => {
              await authClient.signOut();
              await queryClient.invalidateQueries({ queryKey: ['user'] });
              await router.invalidate();
            }}
            type="button"
            className="w-fit"
            variant="destructive"
            size="lg">
            Sign out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>You are not signed in.</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/auth/login">登录</Link>
          </Button>
        </div>
      )}

      <ThemeToggle />

      <a
        className="text-muted-foreground underline hover:text-foreground"
        href="https://github.com/dotnize/tanstarter"
        target="_blank"
        rel="noreferrer noopener">
        dotnize/tanstarter
      </a>
    </div>
  );
}
