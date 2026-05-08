// iCalendar feed for village meetings — residents can subscribe in their phone calendar.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site from '../../data/site.json';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toICalDate(d: Date): string {
  // Format as UTC: YYYYMMDDTHHMMSSZ
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export const GET: APIRoute = async () => {
  const meetings = await getCollection('meetings');
  const now = new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//Village of Midvale//${site.domain.primary}//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(site.name + ' Meetings')}`,
    `X-WR-TIMEZONE:America/New_York`,
  ];

  for (const m of meetings) {
    const start = new Date(m.data.date);
    // Default duration: 90 minutes
    const end = new Date(start.getTime() + 90 * 60 * 1000);
    const title = m.data.body === 'council' ? 'Village Council Meeting' : `${m.data.body} meeting`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${m.id}@${site.domain.primary}`,
      `DTSTAMP:${toICalDate(now)}`,
      `DTSTART:${toICalDate(start)}`,
      `DTEND:${toICalDate(end)}`,
      `SUMMARY:${escapeICS(title)}`,
      `LOCATION:${escapeICS(m.data.location)}`,
      m.data.note ? `DESCRIPTION:${escapeICS(m.data.note)}` : 'DESCRIPTION:',
      `URL:https://${site.domain.primary}/meetings/schedule/`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');

  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
