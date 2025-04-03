'use client';

import { createFileRoute } from '@tanstack/react-router';
import { NestedDropMenu } from '~/components/myui/nested-dropdown';
import Hangye2017 from '~/lib/data/hangye2017.json';

export const Route = createFileRoute('/test3')({
  component: Test,

  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Test() {
  return (
    <div>
      <h1>Test3</h1>
      <NestedDropMenu labelName="选择你的行业类别" options={Hangye2017} />
    </div>
  );
}
