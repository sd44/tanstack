'use client';

import { Clock } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

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
    const value = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(value) && value >= 0 && value <= 23) {
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
    const value = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(value) && value >= 0 && value <= 59) {
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
    <div className="flex w-auto flex-col space-y-2">
      <Label aria-label="时间" htmlFor="hours">
        {getTimeLabel()}
      </Label>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="flex w-auto items-center">
          <Input
            aria-label="小时"
            className="w-16 text-center"
            id="hours"
            max={23}
            min={0}
            onChange={handleHoursChange}
            type="number"
            value={hours.toString().padStart(2, '0')}
          />
          <span className="mx-1 px-1 font-medium text-lg">:</span> {/* 调整冒号间距和样式 */}
          <Input
            aria-label="分钟"
            className="w-16 text-center" // 添加 aria-label 提高可访问性
            id="minutes"
            max={59}
            min={0}
            onChange={handleMinutesChange}
            type="number"
            value={minutes.toString().padStart(2, '0')}
          />
        </div>
      </div>
    </div>
  );
}
