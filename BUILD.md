# Build journal

## Contemporary interface baseline — 2026-10-08

The stylesheet is consolidated around a shared local sans-serif stack, explicit 16px body and 14px control typography, 44px minimum button/input/navigation targets and an 8px spacing rhythm. Headings stop at 48px on desktop and 32px on mobile across product, detail and build routes. Source content, client state, routes, local persistence and file-download semantics are unchanged. Quiet borders replace decorative backgrounds, heavy outlines and offset shadows; the original content objects remain the focal point.

Visual verification covers 1440×1000 and 390×844 primary, detail, interactive and build surfaces, horizontal geometry, focus, source-native controls and no-JavaScript content. `npm test` runs content regressions, production build checks, existing browser/smoke flows and then the shared typography/geometry contract through `npm run test:style`. The existing CI `npm test` step runs this mandatory gate too; no optional or skipped style check is used. To rerun style checks independently, run `npm run build` followed by `npm run test:style`. No new dependencies or external font requests are needed.

## Product-depth patterns — 2026-10-07

`src/calendar.mjs` exports pure `makeIcs(items, generatedAt)`. It writes UTC start/end stamps, stable session ids, actual generation DTSTAMP, escaped text, CRLF separators and UTF-8-aware 75-octet line folding. The old textarea-only export promised a file without providing one. The client now creates a `text/calendar` Blob, activates an anchor with `download='beacon-agenda.ics'`, then revokes the object URL after a short delay; preview remains available. Save changes clear stale preview. Query-selected sessions are resolved against known records and are never silently saved. Product-depth checks cover Unicode folding and timestamps; browser tests await a real download and verify saved-only results at1440/390. Static schedule and session/speaker relationships remain readable without JavaScript.

Verification: `npm test` runs content/model regressions, production artifact checks, contextual browser flows, desktop/mobile screenshots and the original smoke suite. Screenshot proof is under `.screenshots/`; no external services are required.

Last verified: 2026-10-07.

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
