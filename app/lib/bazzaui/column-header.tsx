import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, RotateCcw } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator, // 确保导入 Separator
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* 建议给图标加点左边距，让标题和图标分开点 */}
          <Button variant="ghost" size="sm" className="data-[state=open]:bg-accent ml-3 h-8">
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              column.toggleSorting(false); // false = 升序
            }}>
            {/* 保持图标样式一致 */}
            <ArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            升序
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              column.toggleSorting(true); // true = 降序
            }}>
            {/* 保持图标样式一致 */}
            <ArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            降序
          </DropdownMenuItem>
          {/* 2. 添加分隔线 */}
          <DropdownMenuSeparator />
          {/* 3. 添加还原选项 */}
          <DropdownMenuItem
            onClick={() => {
              column.clearSorting();
            }}>
            <RotateCcw className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            还原
          </DropdownMenuItem>

          {/* 原来的 Hide 选项（保持注释状态） */}
          {/* <DropdownMenuSeparator />
           * <DropdownMenuItem
           *   onClick={() => {
           *     column.toggleVisibility(false);
           *   }}>
           *   <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
           *   Hide
           * </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
