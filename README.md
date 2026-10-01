# Beacon

Beacon is a What Framework starter for a fictional independent technology conference. It combines build-time rendered session/speaker pages with a client-mounted agenda island for topic filters, timezone switching, local personal agenda state and ICS calendar export.

Requires Node.js 22.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Build and test the deployable artifact:

```sh
npm run build
npm run test
```

On minimal Linux CI images that do not already include browser system libraries, use `npx playwright install --with-deps chromium` instead.

## Routes

- `/` — conference front
- `/agenda` — topic-filterable agenda and ICS export
- `/sessions/:slug` — build-time rendered session detail pages
- `/speakers` and `/speakers/:slug` — speaker index and profiles
- `/build` — public build journal
- `/404` — not-found preview; unknown paths return HTTP 404 from root `404.html`

## Vura deployment

```sh
npm ci
npx vura-platform login
npx vura-platform projects create beacon --team <team-id>
# or: npx vura-platform projects link <project-id>
SITE_URL=https://what-starter-beacon-fae244da.vura.app npm run build
npx vura-platform deploy --prod
```

Local builds default to `http://localhost:4173`; production builds should set `SITE_URL` to the deployed origin.

Planned public repository: <https://github.com/CelsianJs/what-starter-beacon>

No secrets, remote assets, tracking or paid services are required.
