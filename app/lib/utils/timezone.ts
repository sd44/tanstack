import {
  CalendarDateTime,
  getLocalTimeZone,
  toCalendarDateTime,
  fromDate,
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
    } catch (e) {
      console.error('Error converting date:', e);
    }
  } else {
    return undefined;
  }
};

// Convert CalendarDateTime to JavaScript Date for the calendar
export const calendarTimeToDate = (
  calendarDateTime: CalendarDateTime | undefined,
): Date | undefined => {
  if (!calendarDateTime) return undefined;
  return calendarDateTime.toDate(getLocalTimeZone());
};
