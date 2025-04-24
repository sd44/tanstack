import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import authClient from '~/lib/utils/auth-client';

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
        console.log(users);
      } catch (e) {
        console.error('failed :', e);
      } finally {
        console.log('finished');
      }
    };
    loadData();
  }, []);
  /* const x = getMyComps(1) */
  return <div>{JSON.stringify(authData, null, 2)}</div>;
}
