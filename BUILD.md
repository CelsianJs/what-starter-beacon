# Build journal

Last verified: 2026-10-01.

## Architecture

- `src/content.mjs` owns session, speaker and route metadata.
- `src/server/render.mjs` renders every public route with `what-framework/server`, including direct session/speaker pages and root `404.html`.
- `src/client/main.jsx` mounts the agenda island; browser JSX is not imported by the Node renderer.
- `scripts/build.mjs` validates `SITE_URL` and writes static HTML, sitemap and robots output under `dist/static`.
- `scripts/check.mjs` validates the emitted Vura route manifest with `@celsian/vura-contract`.

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
- The Opus refinement pass fixed invisible `aria-pressed` states, grouped agenda rows by day in both server and client output, and made time labels non-wrapping.
- Static fallback rows remain whole-card links, while mounted agenda rows expose a title/details anchor beside a separate Save button so interactive controls are not nested.
- A browser smoke assertion now clicks the mounted title/details link on `/agenda` and verifies navigation to `/sessions/state-at-the-edge`.
- Vura upload rejected the first handwritten static manifest because it lacked required `timestamp` and `pages[].filePath` fields. The starter now emits the full manifest contract and maps each route to its promoted public file via `config.staticKey`.
- Linux CI caught a 390px `/build` overflow that macOS system fonts did not reproduce. Grid children now opt into `min-width: 0`, build panels wrap long inline code text, and the smoke test forces a wider fallback font on `/build` without loosening the viewport assertion.

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
