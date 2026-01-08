'use client';

import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';

interface DateTimePickerProps {
  /**
   * The selected date. This is a controlled component, so you must manage this state yourself.
   * IMPORTANT: This component operates on JavaScript `Date` objects, which are based on the user's local timezone.
   * For robust applications, it is highly recommended to convert this date to a timezone-aware format (like ISO 8601 UTC string)
   * before sending it to a server or storing it in a database.
   */
  date?: Date;
  /**
   * Callback function to update the date state.
   */
  setDate: (date: Date | undefined) => void;
  /**
   * Optional: className to apply to the root container.
   */
  className?: string;
}

/**
 * A component that allows users to pick both a date and a time.
 * It combines a calendar for date selection and a time input for time selection.
 * This is a controlled component.
 */
export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  // Memoize the time value to prevent unnecessary re-renders of the time input.
  const timeValue = React.useMemo(() => {
    if (!date) return '';
    // Format to HH:mm:ss for the time input
    return date.toTimeString().slice(0, 8);
  }, [date]);

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) {
      // If the user deselects the date, we clear it.
      setDate(undefined);
      setPopoverOpen(false);
      return;
    }

    // Preserve the time from the existing date, or default to midnight.
    const hours = date?.getHours() ?? 0;
    const minutes = date?.getMinutes() ?? 0;
    const seconds = date?.getSeconds() ?? 0;

    const newDate = new Date(selectedDay);
    newDate.setHours(hours, minutes, seconds);

    setDate(newDate);
    setPopoverOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    if (!(newTime && date)) return;

    // The time input value is expected to be in "HH:mm" or "HH:mm:ss" format.
    const [hours, minutes, seconds = 0] = newTime.split(':').map(Number);

    const newDate = new Date(date);
    newDate.setHours(hours, minutes, seconds);
    setDate(newDate);
  };

  //   const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.stopPropagation(); // Prevent the popover from opening
  //     setDate(undefined);
  //   };

  return (
    <div className={cn('flex gap-2', className)}>
      {/* Date Picker Popover */}
      <div className="flex flex-col gap-2">
        {/* <Label className="px-1" htmlFor="date-picker-button">
          日期
        </Label> */}
        <Popover onOpenChange={setPopoverOpen} open={isPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                'w-40 justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
              id="date-picker-button"
              variant="outline"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString('zh-CN') : '选择日期'}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              captionLayout="dropdown"
              endMonth={new Date()}
              hidden={[{ after: new Date() }]}
              mode="single"
              onSelect={handleDateSelect}
              selected={date}
              startMonth={new Date(2025, 0)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker Input */}
      <div className="flex flex-col">
        {/* <Label className="px-1" htmlFor="time-picker-input">
          时间
        </Label> */}
        <Input
          className="w-full"
          disabled={!date}
          id="time-picker-input" // Show seconds
          onChange={handleTimeChange}
          step="1"
          type="time" // Disable if no date is selected
          value={timeValue}
        />
      </div>
    </div>
  );
}
