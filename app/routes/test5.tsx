import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test5')({
  component: Component,
  loader: () => {
    console.log('Server TEST_ENV_SOURCE:', process.env.TEST_ENV_SOURCE);
    console.log('Server VITE_TEST_ENV_SOURCE:', process.env.VITE_TEST_ENV_SOURCE); // 也可以访问 VITE_ 开头的
    return { message: 'Data loaded' };
  },
});

function Component() {
  return <div>haha</div>;
}
