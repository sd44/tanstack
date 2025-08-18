import {
  type CalendarDateTime,
  fromDate,
  getLocalTimeZone,
  toCalendarDateTime,
} from '@internationalized/date';
import { CalendarIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DateTimePicker } from '~/components/myui/origin-date-time-picker-505';
import { Button } from '~/components/ui/button';
import { DateField, DateInput } from '~/components/ui/datefield-rac';
import { Label } from '~/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

import { cn } from '~/lib/utils';

export interface MyDatePickerProps
  extends Omit<React.ComponentProps<typeof DateField>, 'value' | 'onChange'> {
  label: string;
  labelCls?: string;
  dateCls?: string;
  value?: Date | null; // 外部传入的 JS Date
  onChange?: (date: Date | undefined) => void; // 外部的回调函数，接收 JS Date 或 undefined
}

export function MyDatePicker({
  label,
  labelCls = '',
  dateCls = '',
  value,
  onChange, // <--- 把 onChange 添加到这里解构出来
}: MyDatePickerProps) {
  /*
   * 关于 useCallback：
   * useCallback 用于记忆（缓存）函数本身。只要其依赖数组 `[onChange]` 中的 `onChange` prop
   * 没有改变 (即父组件没有传入一个新的函数引用), `handleDateSelect` 和 `handleDateFieldChange`
   * 函数就不会在每次渲染时重新创建。
   * 这有助于：
   * 1. 性能优化：防止将新的函数实例传递给子组件导致不必要的重渲染。
   * 2. 依赖稳定：当这些函数作为 useEffect 或其他 useCallback 的依赖时，确保依赖项的稳定性。
   * 在这个场景下，确保了只要外部传入的 onChange 函数不变，我们内部包裹的回调函数引用也不变。
   */

  // 内部状态：使用 @internationalized/date 的 CalendarDateTime 类型给 DateField
  const [date, setDate] = useState<CalendarDateTime | null>(null);
  // 内部状态：使用标准的 JavaScript Date 类型给 Calendar 和 TimePicker，并用于最终输出
  const [jsDate, setJsDate] = useState<Date | undefined>();
  // 控制 Popover 的开关状态
  const [open, setOpen] = useState(false);

  // 当外部传入的 value prop 变化时，同步更新内部状态
  useEffect(() => {
    if (value?.getTime() !== jsDate?.getTime()) {
      const newDate = value ? toCalendarDateTime(fromDate(value, getLocalTimeZone())) : null;
      setDate(newDate);
      setJsDate(value || undefined);
    }
  }, [value, jsDate?.getTime]); // 保留原有依赖

  // 处理从 Calendar 或 TimePicker 选择/修改后的 JS Date
  const handleDateSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate?.getTime() !== jsDate?.getTime()) {
        setJsDate(selectedDate);
        onChange?.(selectedDate);

        const calendarDateTime = selectedDate
          ? toCalendarDateTime(fromDate(selectedDate, getLocalTimeZone()))
          : null;
        if (calendarDateTime?.toString() !== date?.toString()) {
          setDate(calendarDateTime);
        }
      }
    },
    [onChange, jsDate, date],
  );

  // 处理 DateField 输入框直接修改后的 CalendarDateTime
  const handleDateFieldChange = useCallback(
    (newDate: CalendarDateTime | null) => {
      setDate(newDate); // 更新内部 CalendarDateTime 状态

      // 将 CalendarDateTime 转换回 JS Date
      const newJsDate = newDate ? newDate.toDate(getLocalTimeZone()) : undefined;
      setJsDate(newJsDate); // 更新内部 JS Date 状态
      onChange?.(newJsDate); // 调用外部传入的 onChange 回调，传递最新的 JS Date
    },
    [onChange], // 依赖于外部传入的 onChange 函数
  );

  // （可选优化）获取用于 Calendar 的 JS Date，优先使用 jsDate 状态
  // 注意：@internationalized/date 的 toDate 方法更直接
  // const getJsDateForCalendar = useCallback(() => jsDate, [jsDate]);

  return (
    <div className="flex flex-wrap">
      {/* 使用 React Aria 的 Label 组件，它会自动与内部的 DateField 关联 */}
      <Label aria-label="日期时间选择" className="flex items-center gap-2">
        <div className={labelCls}>{label}</div>

        {/* DateField 用于显示和通过键盘输入日期时间 */}
        <DateField
          aria-label="日期"
          className="*:not-first:mt-2"
          granularity="minute" // 精确到分钟
          hourCycle={24} // 24小时制
          onChange={handleDateFieldChange} // 绑定到 CalendarDateTime 状态
          value={date} // 输入框内容变化时触发
        >
          <DateInput className={cn(dateCls)} />
        </DateField>

        {/* Popover 用于弹出日历和时间选择器 */}
        <Popover modal onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button className="ml-1" size="icon" variant="outline">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full items-center" forceMount>
            <DateTimePicker onDateTimeChange={handleDateSelect} selectedDate={jsDate} />
            {/* （可选）可以在这里添加一个“完成”按钮来手动关闭 Popover */}
            {/* <div className="flex justify-end p-3 border-t">
              <Button onClick={() => setOpen(false)}>完成</Button>
            </div> */}
          </PopoverContent>
        </Popover>
      </Label>
    </div>
  );
}
