import assert from 'node:assert/strict';
import { sessions, speakers } from '../src/content.mjs';
import { renderRoute } from '../src/server/render.mjs';
import { makeIcs } from '../src/calendar.mjs';
for (const session of sessions) {
  const html = renderRoute(`/sessions/${session.slug}`);
  assert.ok(session.outcomes.length >= 3 && session.abstract.length >= 2);
  assert.ok(html.includes(`/speakers/${session.speaker}`));
  assert.ok(html.includes(`/agenda?session=${session.slug}`));
}
for (const speaker of speakers) assert.ok(renderRoute(`/speakers/${speaker.slug}`).includes('/sessions/'));
const calendar = makeIcs([{ ...sessions[0], summary: 'é'.repeat(100) + ',semi;slash\\\nnext' }], new Date('2026-10-07T12:00:00Z'));
assert.ok(calendar.includes('DTSTAMP:20261007T120000Z'));
assert.ok(calendar.endsWith('\r\n'));
assert.ok(calendar.split('\r\n').every(line => new TextEncoder().encode(line).length <= 75));
assert.ok(calendar.replace(/\r\n /g, '').includes('\\,semi\\;slash\\\\\\nnext'));
console.log('ok session depth and bidirectional speaker routes');
