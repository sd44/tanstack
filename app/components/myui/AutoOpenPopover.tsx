'use client';

import { useState, useEffect, ComponentProps } from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '~/components/ui/popover';

interface AutoOpenPopoverProps {
  shouldOpen: boolean; // Prop to control popover visibility
}

export function AutoOpenPopover({
  shouldOpen = true,
  content = '',
}: {
  shouldOpen: boolean;
  content: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [shouldOpen]);

  return shouldOpen ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor />
      <PopoverContent className="text-sm text-red-600">{content}</PopoverContent>
    </Popover>
  ) : null;
}
