// Date formatting utilities. All output uses America/New_York since Midvale is in Ohio.

const TZ = 'America/New_York';

export function formatDate(date: Date | string, opts: Intl.DateTimeFormatOptions = {}): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

// Returns "MAY 8, 2026" — used in news cards per spec 5.6
export function formatDateAllCaps(date: Date | string): string {
  return formatDateShort(date).toUpperCase();
}
