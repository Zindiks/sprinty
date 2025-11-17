import { DateTime } from 'luxon';
import type { DateLocalizer } from 'react-big-calendar';

/**
 * Luxon-based localizer for react-big-calendar
 * Provides date formatting and manipulation using Luxon
 */
export const luxonLocalizer = (): DateLocalizer => {
  return {
    formats: {
      dateFormat: 'dd',
      dayFormat: 'EEE dd',
      weekdayFormat: 'EEE',
      selectRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
        return `${DateTime.fromJSDate(start).toFormat('MMM dd')} - ${DateTime.fromJSDate(end).toFormat('MMM dd')}`;
      },
      eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
        return `${DateTime.fromJSDate(start).toFormat('h:mm a')} - ${DateTime.fromJSDate(end).toFormat('h:mm a')}`;
      },
      eventTimeRangeStartFormat: ({ start }: { start: Date }) => {
        return DateTime.fromJSDate(start).toFormat('h:mm a');
      },
      eventTimeRangeEndFormat: ({ end }: { end: Date }) => {
        return DateTime.fromJSDate(end).toFormat('h:mm a');
      },
      timeGutterFormat: 'h:mm a',
      monthHeaderFormat: 'MMMM yyyy',
      dayHeaderFormat: 'EEEE MMM dd',
      dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
        return `${DateTime.fromJSDate(start).toFormat('MMM dd')} - ${DateTime.fromJSDate(end).toFormat('MMM dd, yyyy')}`;
      },
      agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
        return `${DateTime.fromJSDate(start).toFormat('MMM dd')} - ${DateTime.fromJSDate(end).toFormat('MMM dd, yyyy')}`;
      },
      agendaDateFormat: 'EEE MMM dd',
      agendaTimeFormat: 'h:mm a',
      agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
        return `${DateTime.fromJSDate(start).toFormat('h:mm a')} - ${DateTime.fromJSDate(end).toFormat('h:mm a')}`;
      },
    },

    firstOfWeek: () => 0, // Sunday

    format: (date: Date, format: string) => {
      return DateTime.fromJSDate(date).toFormat(format);
    },

    parse: (value: string) => {
      return DateTime.fromISO(value).toJSDate();
    },

    startOf: (date: Date, unit: 'day' | 'week' | 'month' | 'year') => {
      return DateTime.fromJSDate(date).startOf(unit).toJSDate();
    },

    endOf: (date: Date, unit: 'day' | 'week' | 'month' | 'year') => {
      return DateTime.fromJSDate(date).endOf(unit).toJSDate();
    },

    add: (date: Date, num: number, unit: 'day' | 'week' | 'month' | 'year') => {
      const unitMap = {
        day: 'days',
        week: 'weeks',
        month: 'months',
        year: 'years',
      } as const;
      return DateTime.fromJSDate(date).plus({ [unitMap[unit]]: num }).toJSDate();
    },

    range: (start: Date, end: Date, unit: 'day' | 'week' | 'month' | 'year' = 'day') => {
      const startDt = DateTime.fromJSDate(start);
      const endDt = DateTime.fromJSDate(end);
      const diff = Math.floor(endDt.diff(startDt, unit).toObject()[`${unit}s`] || 0);

      const range: Date[] = [];
      for (let i = 0; i <= diff; i++) {
        range.push(startDt.plus({ [`${unit}s`]: i }).toJSDate());
      }
      return range;
    },

    ceil: (date: Date, unit: 'day' | 'week' | 'month' | 'year') => {
      const dt = DateTime.fromJSDate(date);
      return dt.startOf(unit).equals(dt) ? dt.toJSDate() : dt.endOf(unit).plus({ seconds: 1 }).toJSDate();
    },

    diff: (start: Date, end: Date, unit: 'day' | 'week' | 'month' | 'year' = 'day') => {
      const unitMap = {
        day: 'days',
        week: 'weeks',
        month: 'months',
        year: 'years',
      } as const;
      return Math.floor(DateTime.fromJSDate(end).diff(DateTime.fromJSDate(start), unitMap[unit]).toObject()[unitMap[unit]] || 0);
    },

    eq: (a: Date, b: Date) => {
      return DateTime.fromJSDate(a).equals(DateTime.fromJSDate(b));
    },

    neq: (a: Date, b: Date) => {
      return !DateTime.fromJSDate(a).equals(DateTime.fromJSDate(b));
    },

    gt: (a: Date, b: Date) => {
      return DateTime.fromJSDate(a) > DateTime.fromJSDate(b);
    },

    gte: (a: Date, b: Date) => {
      return DateTime.fromJSDate(a) >= DateTime.fromJSDate(b);
    },

    lt: (a: Date, b: Date) => {
      return DateTime.fromJSDate(a) < DateTime.fromJSDate(b);
    },

    lte: (a: Date, b: Date) => {
      return DateTime.fromJSDate(a) <= DateTime.fromJSDate(b);
    },

    inRange: (date: Date, start: Date, end: Date) => {
      const dt = DateTime.fromJSDate(date);
      const startDt = DateTime.fromJSDate(start);
      const endDt = DateTime.fromJSDate(end);
      return dt >= startDt && dt <= endDt;
    },

    min: (...dates: Date[]) => {
      return dates.reduce((min, date) => (date < min ? date : min));
    },

    max: (...dates: Date[]) => {
      return dates.reduce((max, date) => (date > max ? date : max));
    },

    minutes: (date: Date) => {
      return DateTime.fromJSDate(date).minute;
    },

    getSlotDate: (date: Date, minutesFromMidnight: number) => {
      return DateTime.fromJSDate(date).startOf('day').plus({ minutes: minutesFromMidnight }).toJSDate();
    },

    getTotalMin: (start: Date, end: Date) => {
      return Math.floor(DateTime.fromJSDate(end).diff(DateTime.fromJSDate(start), 'minutes').minutes);
    },

    getMinutesFromMidnight: (date: Date) => {
      const dt = DateTime.fromJSDate(date);
      return dt.hour * 60 + dt.minute;
    },

    continuesPrior: (start: Date, first: Date) => {
      return DateTime.fromJSDate(start) < DateTime.fromJSDate(first);
    },

    continuesAfter: (end: Date, last: Date) => {
      return DateTime.fromJSDate(end) > DateTime.fromJSDate(last);
    },

    sortEvents: (events: { start: Date; end: Date }[]) => {
      return events.sort((a, b) => {
        const aStart = DateTime.fromJSDate(a.start);
        const bStart = DateTime.fromJSDate(b.start);
        return aStart < bStart ? -1 : aStart > bStart ? 1 : 0;
      });
    },

    merge: (date: Date, time: Date) => {
      const datePart = DateTime.fromJSDate(date);
      const timePart = DateTime.fromJSDate(time);
      return datePart.set({
        hour: timePart.hour,
        minute: timePart.minute,
        second: timePart.second,
      }).toJSDate();
    },
  };
};
