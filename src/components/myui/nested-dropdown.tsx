import { ChevronDownIcon, XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';
import { Input } from '../ui/input';
import type { OptionNode } from './OptionNode';

export type OptionsType = OptionNode[]; // 顶层数据是 OptionNode 数组

interface RenderMenuItemProps {
  node: OptionNode; // 接收一个节点作为 prop
  // 接收一个回调函数，当叶子节点被选中时调用
  onFinalSelect: (value: string, label: string) => void;
}

/**
 * 渲染单个节点。
 * 如果是叶子节点，渲染 <DropdownMenuItem>。
 * 如果有子节点，渲染 <DropdownMenuSub> 并为其子节点递归调用自身。
 */
const RenderMenuItem = ({ node, onFinalSelect }: RenderMenuItemProps) => {
  // 检查节点是否是叶子节点（没有 children 属性，或者 children 数组为空）
  const isLeaf = !node.children || node.children.length === 0;

  if (isLeaf) {
    // --- 叶子节点情况 ---
    // 直接渲染菜单项，显示当前节点的 label
    return (
      <DropdownMenuItem
        key={node.value}
        onSelect={() => {
          // 使用 onSelect 更符合 shadcn 习惯
          onFinalSelect(node.value, node.label);
        }}
      >
        <span>{node.label}</span>
      </DropdownMenuItem>
    );
  }
  // --- 有子节点情况 ---
  // 渲染子菜单结构
  return (
    <DropdownMenuSub key={node.value}>
      {/* 触发器显示当前节点的 label */}
      <DropdownMenuSubTrigger>
        <span>{node.label}</span>
      </DropdownMenuSubTrigger>
      {/* Portal 和 SubContent 用于包裹子菜单项 */}
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {/* 递归渲染子节点 */}
          {node.children?.map((childNode) => (
            // 递归的核心：为每个子节点调用 RenderMenuItem
            <RenderMenuItem
              key={childNode.value}
              node={childNode}
              onFinalSelect={onFinalSelect} // <--- 传递回调
            />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

// --- 使用递归渲染器的父组件 ---
interface NestedDropdownMenuProps {
  labelName: string;
  options: OptionsType; // 接收顶层节点数组
  onValueChange?: (value: string | null, label: string | null) => void;
  initialValue?: string | null; // Optional: Set an initial value
  initialLabel?: string | null; // Optional: Set an initial label matching initialValue
  inputClassName?: string; // Allow custom styling for the input wrapper
}

export function NestedDropMenu({
  labelName,
  options,
  onValueChange,
  initialValue = null,
  initialLabel = null,
  inputClassName,
}: NestedDropdownMenuProps) {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(initialValue);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(initialLabel);

  // Handle final selection from menu items
  const handleFinalSelect = (value: string, label: string) => {
    if (onValueChange) {
      onValueChange(value, label);
    }
    setSelectedValue(value);
    setSelectedLabel(label);
    // Dropdown closes automatically on select
  };

  // Handle clearing the selection
  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectedValue(null);
    setSelectedLabel(null);
    if (onValueChange) {
      onValueChange(null, null); // This will trigger the parent's onValueChange
    }
  };

  // Effect to update state if initialValue/Label props change externally
  // (Optional, depends on use case)
  React.useEffect(() => {
    setSelectedValue(initialValue);
    setSelectedLabel(initialLabel);
  }, [initialValue, initialLabel]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Wrapper div for Input and Icons */}
        <div className={cn('relative w-full cursor-pointer', inputClassName)}>
          <Input
            className="pr-12" // Display selected label or empty string
            placeholder={labelName} // Use labelName as placeholder
            readOnly // Make it non-editable
            value={selectedLabel ?? ''} // Add padding to prevent text overlap with icons
          />
          {/* Conditionally render Clear button */}
          {selectedValue && (
            <Button
              aria-label="Clear selection"
              className="absolute top-1/2 right-7 z-10 h-5 w-5 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
              onPointerDown={handleClear} //z-10确保按钮在最上层
              size="icon"
              variant="ghost"
            >
              <XIcon size={14} strokeWidth={2.5} />
            </Button>
          )}
          {/* Dropdown Indicator */}
          <ChevronDownIcon
            aria-hidden="true" // Position icon
            className="absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 opacity-50"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
        {' '}
        {/* Match trigger width */}
        {/* Optional: Add a "Clear" or "None" option if desired */}
        {/* <DropdownMenuItem onSelect={() => handleFinalSelect(null, null)}>
                        None
                    </DropdownMenuItem>
                    <DropdownMenuSeparator /> */}
        {options.map((topLevelNode) => (
          <RenderMenuItem
            key={topLevelNode.value}
            node={topLevelNode}
            onFinalSelect={handleFinalSelect}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
