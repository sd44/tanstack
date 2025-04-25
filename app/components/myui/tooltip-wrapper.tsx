import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'; // 确保路径正确
// TooltipProvider is NOT imported here - it should be higher up in the app tree

interface TooltipWrapperProps {
  /**
   * The element that triggers the tooltip on hover/focus.
   */
  children: React.ReactNode;
  /**
   * The content to display inside the tooltip. Can be a string or any React node.
   */
  tooltipMsg: React.ReactNode;
  /**
   * Optional: Delay in milliseconds before the tooltip appears.
   * Passed directly to the Tooltip component.
   */
  delayDuration?: number;
  /**
   * Optional: The preferred side of the trigger element to render the tooltip on.
   * Passed directly to the TooltipContent component.
   * Default: 'top'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Optional: The preferred alignment of the tooltip relative to the trigger element.
   * Passed directly to the TooltipContent component.
   * Default: 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Optional: The distance in pixels from the trigger element.
   * Passed directly to the TooltipContent component.
   * Default: 0
   */
  sideOffset?: number;
  /**
   * Optional: An offset in pixels from the edge of the tooltip alignment.
   * Passed directly to the TooltipContent component.
   * Default: 0
   */
  alignOffset?: number;
  /**
   * Optional: Additional CSS classes to apply to the TooltipContent element.
   */
  contentClassName?: string;
}

export function TooltipWrapper({
  children,
  tooltipMsg,
  delayDuration = 100,
  side,
  align,
  sideOffset,
  alignOffset,
  contentClassName,
}: TooltipWrapperProps) {
  // Don't render tooltip logic if there's no message or no child
  if (!tooltipMsg || !children) {
    return <>{children}</>; // Return children directly without tooltip
  }

  return (
    // Note: TooltipProvider should wrap the part of your application
    // where you intend to use these TooltipWrapper components.
    // It's not included within this reusable component itself.
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={contentClassName} // Apply optional classes here
      >
        {/* Render tooltipMsg directly - allows strings or complex React nodes */}
        {/* If you always want simple text wrapped in a <p>, you could do:
           {typeof tooltipMsg === 'string' ? <p>{tooltipMsg}</p> : tooltipMsg}
           But rendering directly is more flexible. */}
        {typeof tooltipMsg === 'string' ? <p>{tooltipMsg}</p> : tooltipMsg}
      </TooltipContent>
    </Tooltip>
  );
}
