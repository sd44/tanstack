'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  locale?: string;
}

export function TimePickerDemo({ date, setDate, locale = 'en-US' }: TimePickerDemoProps) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  // Update local state when date prop changes
  useEffect(() => {
    if (date) {
      setHours(date.getHours());
      setMinutes(date.getMinutes());
    }
  }, [date]);

  // Handle hours change
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 23) {
      setHours(value);

      if (date) {
        const newDate = new Date(date);
        newDate.setHours(value);
        setDate(newDate);
      }
    }
  };

  // Handle minutes change
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value);

      if (date) {
        const newDate = new Date(date);
        newDate.setMinutes(value);
        setDate(newDate);
      }
    }
  };

  // Get localized label text
  const getTimeLabel = () => {
    return locale.startsWith('zh') ? '时间' : 'Time';
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="time">{getTimeLabel()}</Label>
      <div className="flex items-center space-x-2">
        <Clock className="text-muted-foreground h-4 w-4" />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <Input
              id="hours"
              className="w-16 text-center"
              value={hours.toString().padStart(2, '0')}
              onChange={handleHoursChange}
              min={0}
              max={23}
              type="number"
            />
            <span className="mx-1">:</span>
            <Input
              id="minutes"
              className="w-16 text-center"
              value={minutes.toString().padStart(2, '0')}
              onChange={handleMinutesChange}
              min={0}
              max={59}
              type="number"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
