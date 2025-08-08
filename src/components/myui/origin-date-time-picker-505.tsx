import { format } from 'date-fns';
// Import the locale object
import { zhCN } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { ScrollArea } from '~/components/ui/scroll-area';

interface DateTimePickerProps {
  selectedDate?: Date;
  onDateTimeChange?: (date: Date) => void;
}

export function DateTimePicker({ selectedDate, onDateTimeChange }: DateTimePickerProps) {
  const today = new Date();
  const [date, setDate] = useState<Date>(selectedDate || today);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (time && date && selectedDate?.getTime() !== date.getTime()) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      onDateTimeChange?.(newDate);
    }
  }, [time, date, onDateTimeChange, selectedDate?.getTime]); // 移除 onDateTimeChange 依赖

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate || newDate.getTime() === date.getTime()) return;

    setDate(newDate);
    setTime(null);
    // 立即触发回调而不等待时间选择
    onDateTimeChange?.(newDate);
  };

  // Mock time slots data
  const timeSlots = [
    { time: '08:00', available: true },
    { time: '08:30', available: true },
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: true },
    { time: '12:30', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
  ];

  return (
    <div>
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <Calendar
            className="p-2 sm:pe-5"
            disabled={[
              { after: today }, // Dates before today
            ]}
            locale={zhCN}
            mode="single"
            onSelect={handleDateSelect}
            selected={date}
          />
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="font-medium text-sm">
                      {format(date, 'd, EEEE', { locale: zhCN })}
                    </p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        className="w-full"
                        disabled={!available}
                        key={timeSlot}
                        onClick={() => {
                          if (time !== timeSlot) {
                            setTime(timeSlot);
                            const newDate = new Date(date);
                            const [hours, minutes] = timeSlot.split(':').map(Number);
                            newDate.setHours(hours, minutes);

                            // 只有当日期发生变化时才触发回调
                            if (newDate.getTime() !== selectedDate?.getTime()) {
                              onDateTimeChange?.(newDate);
                            }
                          }
                        }}
                        size="sm"
                        variant={time === timeSlot ? 'default' : 'outline'}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
