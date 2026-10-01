# Build journal

Last verified: 2026-10-01.

## Architecture

- `src/content.mjs` owns session, speaker and route metadata.
- `src/server/render.mjs` renders every public route with `what-framework/server`, including direct session/speaker pages and root `404.html`.
- `src/client/main.jsx` mounts the agenda island; browser JSX is not imported by the Node renderer.
- `scripts/build.mjs` validates `SITE_URL`, writes static HTML, sitemap, robots and `dist/manifest.json`.

## What Framework patterns

- Signals: topic filter, timezone, saved sessions, storage mode and ICS output.
- Computed values: filtered schedule and VCALENDAR text.
- Effects: local agenda persistence through safe storage wrappers.
- Routing/SSG: sessions and speakers generate direct static routes.

## Lessons and limitations

- `mount()` creates client-mounted islands over static fallbacks; it is not SSR-preserving hydration.
- Storage APIs can throw in locked-down contexts, so agenda reads/writes use safe wrappers and a tab-local memory fallback.
- ICS export is generated locally from fictional sessions; there is no ticketing, sync, analytics or external calendar API.
- The refined home page now exposes the next session and schedule rows immediately; it avoids relying on a poster graphic as the primary event object.

## Reference snippets

```js
const filtered = useComputed(() =>
  topic() === 'all' ? data.sessions : data.sessions.filter((session) => session.topic === topic())
);
```

```js
const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
lines.push('BEGIN:VEVENT', `SUMMARY:${escapeIcs(item.title)}`, 'END:VEVENT');
```

## Verification plan

The smoke suite checks desktop routes, direct session/speaker pages, topic filtering, timezone switching, saved agenda, valid ICS text, corrupt/denied storage recovery, mobile screenshot capture and genuine HTTP 404.
