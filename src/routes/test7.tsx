import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import authClient from '~/lib/auth/auth-client';

export const Route = createFileRoute('/test7')({
  component: Component,
});

function Component() {
  const [authData, setAuthData] = useState<any>();
  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await authClient.admin.listUsers({
          query: {
            limit: 10,
          },
        });
        setAuthData(users);
      } catch (_e) {
        console.log('error', _e);
      }
    };
    loadData();
  }, []);
  /* const x = getMyComps(1) */
  return <div>{JSON.stringify(authData, null, 2)}</div>;
}
