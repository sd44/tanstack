'use client';

import { createFileRoute } from '@tanstack/react-router';

function MyComponent() {
  // 使用 useRouteContext hook，并指定正确的上下文类型

  const { user } = Route.useLoaderData();
  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}

export const Route = createFileRoute('/test2')({
  component: Component,

  loader: ({ context }) => {
    return { user: context.user };
  },
});

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export default function Component() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Rich menu
          <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Archive</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Move to project</DropdownMenuItem>
                <DropdownMenuItem>Move to folder</DropdownMenuItem>

                <DropdownMenuItem>Advanced options</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Add to favorites</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem variant="destructive">
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* 没有子节点的情况 */
{
  <DropdownMenuItem>
    <span>Archive</span>
  </DropdownMenuItem>;
}

/* 有子节点的情况 */

/* <DropdownMenuSub>
*   <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
*   <DropdownMenuPortal>
*     <DropdownMenuSubContent>
*       <DropdownMenuItem>Move to project</DropdownMenuItem>
*       <DropdownMenuItem>Move to folder</DropdownMenuItem>

*       <DropdownMenuItem>Advanced options</DropdownMenuItem>
*     </DropdownMenuSubContent>
*   </DropdownMenuPortal>
* </DropdownMenuSub> */

function DataDisplay({ data }) {
  return (
    <div>
      <h2>Data Details</h2>

      {/* 检查对象属性是否存在并渲染 */}
      {data?.user?.name ? <p>User Name: {data.user.name}</p> : <p>User name not available.</p>}

      {/* 检查数组是否有元素并渲染列表 */}
      {data?.permissions?.length > 0 ? (
        <div>
          <h3>Permissions:</h3>
          <ul>
            {data.permissions.map((permission, index) => (
              <li key={index}>{permission}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No permissions found.</p>
      )}

      {/* 检查嵌套对象属性 */}
      {data?.config?.timeout ? (
        <p>Timeout setting: {data.config.timeout}ms</p>
      ) : (
        <p>Timeout configuration missing.</p>
      )}
    </div>
  );
}
