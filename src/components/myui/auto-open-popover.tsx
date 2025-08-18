'use client';

import { useEffect, useState } from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '~/components/ui/popover';

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
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverAnchor />
      <PopoverContent className="text-red-600 text-sm">{content}</PopoverContent>
    </Popover>
  ) : null;
}
