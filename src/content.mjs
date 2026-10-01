export const site = { name: 'Beacon', description: 'A fictional independent technology conference starter with static sessions and a local personal agenda.', repo: 'https://github.com/CelsianJs/what-starter-beacon', expectedUrl: 'https://what-starter-beacon-fae244da.vura.app' };
export const speakers = [
  { slug: 'mina-orbit', name: 'Mina Orbit', role: 'Systems artist', bio: 'Builds theatrical interfaces for research tools.' },
  { slug: 'sol-rao', name: 'Sol Rao', role: 'Runtime engineer', bio: 'Works on long-running compute and small reliable queues.' },
  { slug: 'june-vale', name: 'June Vale', role: 'Design technologist', bio: 'Designs schedule systems for public festivals.' },
];
export const sessions = [
  { slug: 'state-at-the-edge', title: 'State at the edge', topic: 'platform', speaker: 'sol-rao', starts: '2026-08-14T14:00:00Z', minutes: 45, room: 'Ultramarine hall', summary: 'How tiny state machines make serverless interfaces feel continuous.' },
  { slug: 'interfaces-that-sing', title: 'Interfaces that sing', topic: 'design', speaker: 'mina-orbit', starts: '2026-08-14T15:15:00Z', minutes: 40, room: 'Citrus room', summary: 'A tour through playful tools that still respect accessibility and speed.' },
  { slug: 'the-human-schedule', title: 'The human schedule', topic: 'product', speaker: 'june-vale', starts: '2026-08-15T13:30:00Z', minutes: 50, room: 'Beacon stage', summary: 'Making dense agendas readable across timezones, devices and energy levels.' },
  { slug: 'cache-poetics', title: 'Cache poetics', topic: 'platform', speaker: 'mina-orbit', starts: '2026-08-15T16:00:00Z', minutes: 35, room: 'Ultramarine hall', summary: 'A practical session on freshness, tags and humane invalidation.' },
];
export const routes = [
  { path: '/', title: 'Beacon conference' },
  { path: '/agenda', title: 'Agenda' },
  { path: '/speakers', title: 'Speakers' },
  { path: '/build', title: 'Build journal' },
  ...sessions.map((session) => ({ path: `/sessions/${session.slug}`, title: session.title })),
  ...speakers.map((speaker) => ({ path: `/speakers/${speaker.slug}`, title: speaker.name })),
  { path: '/404', title: 'Not found' },
];
