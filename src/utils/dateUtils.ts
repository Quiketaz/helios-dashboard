import type { QRecord } from '../types';

/**
 * Parses a date string in M/D/YYYY format into a Date object.
 */
export const parseDate = (dateStr: string): Date => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Returns the start of the week (Sunday) for a given date.
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const diff = d.getDate() - dayOfWeek;
  return new Date(d.setDate(diff));
};

/**
 * Calculates the date range [start, end] for a week based on an offset from today.
 */
export const getWeekRange = (weekOffset: number): [Date, Date] => {
  const today = new Date();
  const start = getWeekStart(today);
  start.setDate(start.getDate() + weekOffset * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return [start, end];
};

/**
 * Formats a week range into a human-readable label (e.g., "Jan 1 - Jan 7").
 */
export const formatWeekLabel = (start: Date, end: Date): string => {
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} - ${endStr}`;
};

/**
 * Filters and sorts a list of workout records for a specific week offset.
 */
export const getEventsForWeek = (events: QRecord[], weekOffset: number): QRecord[] => {
  const [weekStart, weekEnd] = getWeekRange(weekOffset);
  return events
    .filter((event) => {
      try {
        const eventDate = parseDate(event.date);
        return eventDate >= weekStart && eventDate <= weekEnd;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
      } catch {
        return 0;
      }
    });
};