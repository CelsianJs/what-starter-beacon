import { existsSync } from 'node:fs';
import { sessions, speakers, routes } from '../src/content.mjs';
import { validateVuraStaticManifest } from './vura-static-check.mjs';

const expected = routes.length;
if (!existsSync('dist/static/index.html')) throw new Error('missing root index');
if (!existsSync('dist/static/404.html')) throw new Error('missing root 404');
for (const session of sessions) {
  if (!existsSync(`dist/static/sessions/${session.slug}/index.html`)) throw new Error(`missing session ${session.slug}`);
}
for (const speaker of speakers) {
  if (!existsSync(`dist/static/speakers/${speaker.slug}/index.html`)) throw new Error(`missing speaker ${speaker.slug}`);
}
const manifestPages = validateVuraStaticManifest(expected);
console.log(`check OK: ${routes.length} routes, ${sessions.length} sessions, ${speakers.length} speakers, ${manifestPages} canonical Vura manifest pages validated.`);
