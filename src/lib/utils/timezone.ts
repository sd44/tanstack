import {
  type CalendarDateTime,
  fromDate,
  getLocalTimeZone,
  toCalendarDateTime,
} from '@internationalized/date';

// Convert JavaScript Date to CalendarDateTime for React Aria
export const dateToCalendarTime = (
  selectedDate: Date | undefined,
): CalendarDateTime | undefined => {
  if (selectedDate) {
    try {
      // Convert JavaScript Date to CalendarDateTime using fromDate
      const calendarDateTime = toCalendarDateTime(fromDate(selectedDate, getLocalTimeZone()));
      return calendarDateTime;
    } catch (_e) {
      console.error('日期转换失败:', _e);
    }
  } else {
    return;
  }
};

// Convert CalendarDateTime to JavaScript Date for the calendar
export const calendarTimeToDate = (
  calendarDateTime: CalendarDateTime | undefined,
): Date | undefined => {
  if (!calendarDateTime) return;
  return calendarDateTime.toDate(getLocalTimeZone());
};
