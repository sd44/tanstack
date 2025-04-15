import { createFileRoute } from '@tanstack/react-router';
import { CalendarIcon, Clock } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Label } from '~/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Input } from '~/components/ui/input';
import { useId, useState } from 'react';
import Cs2 from '~/components/comp-40';

export const Route = createFileRoute('/test5')({
  component: Cs2,
});

export default function Component() {
  const id = useId();
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div>
      <div className="*:not-first:mt-2">
        <Label htmlFor={id}>Date and time picker</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={'outline'}
              className={cn(
                'group bg-background hover:bg-background border-input w-full px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
                !date && 'text-muted-foreground',
              )}>
              <div className="flex w-full items-center justify-between">
                <span className={cn('mr-2 truncate', !date && 'text-muted-foreground')}>
                  {date
                    ? format(date, 'PPP') +
                      (date.getHours() || date.getMinutes() ? ` ${format(date, 'HH:mm')}` : '')
                    : 'Pick a date and time'}
                </span>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <Clock
                    size={16}
                    className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                  <CalendarIcon
                    size={16}
                    className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} />
            <div className="mt-2 border-t px-3 py-2">
              <Label htmlFor="time-input" className="mb-2 block">
                Time (24-hour format)
              </Label>
              <Input
                id="time-input"
                type="time"
                className="w-full"
                value={
                  date
                    ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
                    : ''
                }
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newDate = new Date(date || new Date());
                  newDate.setHours(hours);
                  newDate.setMinutes(minutes);
                  setDate(newDate);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with{' '}
        <a
          className="hover:text-foreground underline"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noreferrer noopener nofollow">
          React DayPicker
        </a>
      </p>
    </div>
  );
}
