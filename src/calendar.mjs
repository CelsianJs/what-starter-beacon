export function makeIcs(items, generatedAt = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Beacon Demo//EN', 'CALSCALE:GREGORIAN'];
  for (const item of items) {
    const start = new Date(item.starts);
    const end = new Date(start.getTime() + item.minutes * 60000);
    lines.push('BEGIN:VEVENT', `UID:${item.slug}@beacon.local`, `DTSTAMP:${stamp(generatedAt)}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${escapeIcs(item.title)}`, `LOCATION:${escapeIcs(item.room)}`, `DESCRIPTION:${escapeIcs(item.summary)}`, 'END:VEVENT');
  }
  return [...lines, 'END:VCALENDAR'].map(foldLine).join('\r\n') + '\r\n';
}

function stamp(date) { return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
function escapeIcs(value) { return String(value).replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n'); }
function foldLine(line) {
  const encoder = new TextEncoder();
  let result = '', width = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    if (width + bytes > 75) { result += '\r\n '; width = 1; }
    result += char; width += bytes;
  }
  return result;
}
