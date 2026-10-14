/** Escape text so it can be used safely inside a RegExp. */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Format a date using a pattern made of yyyy, mm, dd (e.g. "yyyy-dd-mm").
 * OrangeHRM shows its expected pattern in the input placeholder,
 * so the page objects read it and format the date to match.
 */
export function formatDate(date: Date, pattern: string): string {
  const parts: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    mm: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
  };
  return pattern.replace(/yyyy|mm|dd/gi, (token) => parts[token.toLowerCase()]);
}

/** Returns the next Monday-Friday date, at least `daysAhead` days from today. */
export function nextWeekday(daysAhead = 1): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

/**
 * A working day inside the current calendar year: tomorrow's working day,
 * or (in the last days of December) the most recent past working day.
 * Keeps leave tests inside the default leave period all year round.
 */
export function workingDayThisYear(): Date {
  const next = nextWeekday();
  if (next.getFullYear() === new Date().getFullYear()) return next;
  const day = new Date();
  while (day.getDay() === 0 || day.getDay() === 6) {
    day.setDate(day.getDate() - 1);
  }
  return day;
}
