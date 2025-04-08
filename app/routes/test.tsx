import { createFileRoute } from '@tanstack/react-router';

import { MinMaxInput } from '~/components/myui/origin-minmax';
import { DebouncedInput } from '~/lib/table/debouncedInput';

export const Route = createFileRoute('/test')({
  component: MyComponent,
});

function MyComponent() {
  // 使用 useRouteContext hook，并指定正确的上下文类型

  const changed = (value: string | number) => {
    console.log('in debouncing: ' + value);
  };
  return (
    <div>
      <MinMaxInput />
      <DebouncedInput value={35} onChange={changed} />
    </div>
  );
}
