import { existsSync, readFileSync } from 'node:fs';
import { sessions, speakers, routes } from '../src/content.mjs';

const manifest = JSON.parse(readFileSync('dist/manifest.json', 'utf8'));
const expected = routes.filter((route) => route.path !== '/404').length;
if (!existsSync('dist/static/index.html')) throw new Error('missing root index');
if (!existsSync('dist/static/404.html')) throw new Error('missing root 404');
for (const session of sessions) {
  if (!existsSync(`dist/static/sessions/${session.slug}/index.html`)) throw new Error(`missing session ${session.slug}`);
}
for (const speaker of speakers) {
  if (!existsSync(`dist/static/speakers/${speaker.slug}/index.html`)) throw new Error(`missing speaker ${speaker.slug}`);
}
if (manifest.routes.length !== expected) throw new Error(`manifest route mismatch ${manifest.routes.length}/${expected}`);
console.log(`check OK: ${routes.length} routes, ${sessions.length} sessions, ${speakers.length} speakers, ${manifest.routes.length} manifest pages.`);
