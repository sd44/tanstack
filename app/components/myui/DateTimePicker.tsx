import { useState, useCallback, useEffect } from 'react';
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

import { zhCN } from 'date-fns/locale'; // 确认引入了中文 locale
import { cn } from '~/lib/utils';

// 为组件设置 locale
const LOCALE = 'zh-CN'; // 使用中国大陆 locale

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
    if (value) {
      const zoneTime = fromDate(value, getLocalTimeZone());
      const calendarTime = toCalendarDateTime(zoneTime);
      setDate(calendarTime);
      setJsDate(value); // 直接使用传入的 value 更新 jsDate
    } else {
      setDate(null);
      setJsDate(undefined);
    }
  }, [value]); // 依赖于外部传入的 value

  // 处理从 Calendar 或 TimePicker 选择/修改后的 JS Date
  const handleDateSelect = useCallback(
    (selectedDate: Date | undefined) => {
      setJsDate(selectedDate); // 更新内部 JS Date 状态
      onChange?.(selectedDate); // 调用外部传入的 onChange 回调，传递最新的 JS Date

      // 如果有选中的日期，则同步更新 CalendarDateTime 状态给 DateField
      if (selectedDate) {
        const calendarDateTime = toCalendarDateTime(fromDate(selectedDate, getLocalTimeZone()));
        setDate(calendarDateTime);
      } else {
        setDate(null);
      }
      // 可以在这里选择性地关闭 Popover，例如仅在时间选择器确认后关闭
      // setOpen(false);
    },
    [onChange], // 依赖于外部传入的 onChange 函数
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
      <Label className="flex items-center gap-2" aria-label="日期时间选择">
        <div className={labelCls}>{label}</div>

        {/* DateField 用于显示和通过键盘输入日期时间 */}
        <DateField
          aria-label="日期"
          className="w-full *:not-first:mt-2"
          granularity="minute" // 精确到分钟
          hourCycle={24} // 24小时制
          value={date} // 绑定到 CalendarDateTime 状态
          onChange={handleDateFieldChange} // 输入框内容变化时触发
        >
          <DateInput className={cn('w-full', dateCls)} />
        </DateField>

        {/* Popover 用于弹出日历和时间选择器 */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="ml-1">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="items-center" align="center">
            <div className="w-full">
              {/* 日历组件 */}
              <Calendar
                mode="single"
                selected={jsDate} // Calendar 使用标准的 JS Date
                onSelect={(newSelectedDay) => {
                  // 当仅选择日期时，需要合并当前的时间（如果存在）
                  if (newSelectedDay) {
                    const currentHour = jsDate?.getHours() ?? 0;
                    const currentMinute = jsDate?.getMinutes() ?? 0;
                    // 创建一个新的 Date 对象，设置年月日，并保留时分
                    const updatedDate = new Date(newSelectedDay);
                    updatedDate.setHours(currentHour, currentMinute, 0, 0); // 秒和毫秒设为0
                    handleDateSelect(updatedDate); // 更新状态并触发回调
                  } else {
                    handleDateSelect(undefined); // 清除日期
                  }
                  // 选择日期后通常不立即关闭 Popover，以便继续选择时间
                }}
                initialFocus
                locale={zhCN} // 为日历指定中文 locale
              />
              {/* 时间选择器 */}
              <div className="mt-4 border-t pt-4">
                <TimePickerDemo
                  date={jsDate} // TimePicker 也使用 JS Date
                  setDate={handleDateSelect} // 时间变化时，调用 handleDateSelect 更新完整日期时间
                  locale={LOCALE} // 为时间选择器指定 locale
                />
              </div>
            </div>
            {/* （可选）可以在这里添加一个“完成”按钮来手动关闭 Popover */}
            {/* <div className="p-3 border-t flex justify-end">
              <Button onClick={() => setOpen(false)}>完成</Button>
            </div> */}
          </PopoverContent>
        </Popover>
      </Label>
    </div>
  );
}
