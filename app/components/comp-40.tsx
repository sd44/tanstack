import { useState, useCallback } from 'react';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '~/hooks/form-context';

import { Label } from '~/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { DateField, DateInput } from '~/components/ui/datefield-rac';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Calendar } from '~/components/ui/calendar';
import { TimePickerDemo } from '~/components/time-picker';
import {
  type CalendarDateTime,
  getLocalTimeZone,
  toCalendarDateTime,
  fromDate,
} from '@internationalized/date';

import { zhCN } from 'date-fns/locale';
import { cn } from '~/lib/utils';

// Set the locale for the component
const LOCALE = 'zh-CN';

interface MyDatePickerProps {
  label: string;
  labelCls?: string; //labelCls 变为可选
  dateCls?: string; //inputCls 变为可选
  value: Date;
}

export default function MyDatePicker({
  label,
  labelCls = 'w-24',
  dateCls = '',
  value,
}: MyDatePickerProps) {
  const field = useFieldContext<Date>();

  const meta = useStore(field.store, (state) => state.meta);

  /* useCallback的意思要弄明白 */

  /* const zoneTime = fromDate(value, getLocalTimeZone());
   * const calendarTime = toCalendarDateTime(zoneTime); */
  const [date, setDate] = useState<CalendarDateTime | null>();
  const [jsDate, setJsDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  // Convert JavaScript Date to CalendarDateTime for React Aria
  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    if (selectedDate) {
      setJsDate(selectedDate);
      try {
        // Convert JavaScript Date to CalendarDateTime using fromDate
        const calendarDateTime = toCalendarDateTime(fromDate(selectedDate, getLocalTimeZone()));
        setDate(calendarDateTime);
      } catch (e) {
        console.error('Error converting date:', e);
      }
    } else {
      setJsDate(undefined);
      setDate(undefined);
    }
  }, []);

  // Convert CalendarDateTime to JavaScript Date for the calendar
  const getJsDateFromCalendarDate = useCallback(() => {
    if (!date) return undefined;

    // Only create a new Date object if we don't already have one
    if (!jsDate) {
      return new Date(date.year, date.month - 1, date.day, date.hour, date.minute);
    }

    return jsDate;
  }, [date, jsDate]);

  // Handle date change from DateField
  const handleDateFieldChange = useCallback((newDate: CalendarDateTime | null) => {
    setDate(newDate);

    if (newDate) {
      // Create a JavaScript Date object with the correct local time
      const newJsDate = new Date(
        newDate.year,
        newDate.month - 1,
        newDate.day,
        newDate.hour,
        newDate.minute,
      );
      setJsDate(newJsDate);
    } else {
      setJsDate(undefined);
    }
  }, []);

  return (
    <div className="flex flex-wrap">
      <Label className="flex w-full items-center gap-2">
        <div className={labelCls}>{label}</div>

        <DateField
          className="w-full *:not-first:mt-2"
          granularity="minute"
          hourCycle={24}
          value={handleDateSelect(value) ?? null}
          onChange={handleDateFieldChange}>
          <DateInput className={cn('w-full', dateCls)} />
        </DateField>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="ml-1">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <Calendar
                mode="single"
                selected={getJsDateFromCalendarDate()}
                onSelect={(newDate) => {
                  handleDateSelect(newDate);
                  // Don't close the popover when selecting a date
                }}
                autoFocus
                locale={zhCN}
              />
              <div className="mt-4 border-t pt-4">
                <TimePickerDemo
                  date={getJsDateFromCalendarDate()}
                  setDate={handleDateSelect}
                  locale={LOCALE}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Label>
    </div>
  );
}
