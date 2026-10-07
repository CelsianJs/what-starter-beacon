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

const sessionDetails = [
  { format: 'Talk + live model walkthrough', audience: 'Engineers designing offline and distributed interfaces', abstract: ['A request can finish while a user’s task is still in progress. Sol traces a small editing workflow through a dropped connection, a retry and a late response to show why explicit state beats a pile of loading booleans.', 'The walkthrough compares optimistic and confirmed state, assigns ownership to pending work, and shows when a local queue should stop retrying. The examples are conceptual and do not depend on a particular cloud provider.'], outcomes: ['Sketch a state chart for a retryable action', 'Separate optimistic display from confirmed state', 'Choose a visible recovery path for failed work'] },
  { format: 'Design talk + annotated interaction studies', audience: 'Designers and engineers working on creative tools', abstract: ['Play can make a complex tool easier to enter, but it can also hide the action a visitor needs. Mina examines three interface studies where sound, motion and shape each have a defined job rather than acting as a layer of spectacle.', 'The session follows those studies through keyboard navigation, reduced-motion settings and slow hardware. It asks what remains when the playful layer is removed, and how to make the underlying task satisfying on its own.'], outcomes: ['Give each expressive gesture a functional role', 'Plan a complete reduced-motion alternative', 'Test playful controls beyond a pointer device'] },
  { format: 'Workshop-style talk', audience: 'Product teams publishing dense public schedules', abstract: ['A schedule is a set of choices under time pressure. June works through a fictional two-day festival to show how date, timezone, room and duration can become a readable hierarchy instead of competing labels.', 'The second half follows a visitor who saves one session, changes timezone and returns on a smaller screen. The exercise distinguishes a personal agenda from a topic filter and considers the awkward moments when plans overlap.'], outcomes: ['Make date and timezone context explicit', 'Distinguish browsing from a saved personal plan', 'Design schedule rows that work as keyboard targets'] },
  { format: 'Technical talk + decision worksheet', audience: 'Engineers and product designers owning freshness policies', abstract: ['Freshness is a product decision before it is a cache header. Mina compares an exhibition catalogue, a changing seat count and a collaborative notebook to show why each needs a different promise about when information changes.', 'A simple worksheet names the data owner, the acceptable stale window and the event that ends that window. The talk then explores how to explain a stale result without turning every screen into a warning banner.'], outcomes: ['Name a freshness contract for one domain object', 'Connect invalidation to a meaningful event', 'Write a useful stale-state explanation'] },
];
sessions.forEach((session, index) => Object.assign(session, sessionDetails[index]));
speakers[0].bio = 'Mina works where research instruments and expressive interfaces meet. Her fictional practice explores how motion, annotation and playful controls can make complex systems legible without hiding their limits. At Beacon she connects interaction design to the quieter product decisions around freshness and trust.';
speakers[1].bio = 'Sol is a fictional runtime engineer focused on small, inspectable systems. His work follows tasks through queues, retries and unreliable connections, with a particular interest in the moment when a user needs an explanation rather than another spinner. He teaches through state diagrams and deliberately compact examples.';
speakers[2].bio = 'June is a fictional design technologist studying how people move through public events. She turns schedules, room changes and access information into interfaces that remain useful under pressure. Her approach treats a calendar as a human planning tool, not merely a list of timestamps.';
