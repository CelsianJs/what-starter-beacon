# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-01
- Primary product surfaces: Conference front, agenda, session detail, speaker detail, build journal, not-found page.
- Evidence reviewed: Starter brief; sibling What/Vura starter pattern.

## Brand
- Personality: Bright, independent, schedule-focused, practical.
- Trust signals: Direct session pages, visible local-only agenda boundary, valid calendar export.
- Avoid: Generic SaaS landing-page structure, ticketing claims, analytics or real event data.

## Product goals
- Goals: Demonstrate static conference content with reactive agenda filtering, timezone switching, personal agenda state and ICS export.
- Non-goals: Ticket sales, real registration, live streaming, remote calendar sync.
- Success signals: Users can filter sessions, save a session, switch timezone, export VCALENDAR text, and direct-load detail pages.

## Personas and jobs
- Primary personas: Framework evaluator, conference-site builder, agent adapting a starter.
- User jobs: Reuse schedule UI, understand What signals/computed/effects, deploy static output to Vura.
- Key contexts of use: Desktop agenda review, mobile personal agenda, storage-restricted browsers.

## Information architecture
- Primary navigation: Agenda, Speakers, Build.
- Core routes/screens: `/`, `/agenda`, `/sessions/:slug`, `/speakers`, `/speakers/:slug`, `/build`, `/404`.
- Content hierarchy: Event pitch, schedule, session details, speaker roster, build notes.

## Design principles
- Principle 1: Make the schedule the product, not a hidden secondary page.
- Principle 2: Color can be loud if hierarchy and controls stay legible.
- Tradeoffs: ICS is text-exported locally rather than integrated with external calendar services.

## Visual language
- Color: Citrus yellow, ultramarine, pink accents, cream paper.
- Typography: Heavy system sans with compressed, energetic headlines.
- Spacing/layout rhythm: Chunky schedule rows, badges, high-contrast panels.
- Shape/radius/elevation: Rounded panels with visible offset shadows.
- Motion: Minimal hover/focus transitions; reduced motion disables movement.
- Imagery/iconography: CSS burst shapes and colored schedule blocks; no remote assets.

## Components
- Existing components to reuse: What signals/computed/effects, static server renderer, Vura scripts.
- New/changed components: Topic filters, timezone select, save buttons, ICS export, session/speaker cards.
- Variants and states: Empty saved agenda, corrupt storage, denied storage, exported calendar.
- Token/component ownership: CSS in `src/styles.css`; data in `src/content.mjs`; client state in `src/client/main.jsx`.

## Accessibility
- Target standard: Practical WCAG AA.
- Keyboard/focus behavior: Filters, selects, save and export buttons are keyboard reachable.
- Contrast/readability: High-contrast text; color is not the only topic signal.
- Screen-reader semantics: Live saved-count status, labels, times and buttons.
- Reduced motion and sensory considerations: No essential animation.

## Responsive behavior
- Supported breakpoints/devices: 360px mobile through desktop.
- Layout adaptations: Schedule rows collapse from three columns to single-column cards.
- Touch/hover differences: Hover decorative only; all actions work by tap/keyboard.

## Interaction states
- Loading: Static schedule fallback remains readable.
- Empty: ICS textarea explains how to export after saving sessions.
- Error: Corrupt storage resets saved agenda; denied storage shows visible boundary.
- Success: ICS textarea contains `BEGIN:VCALENDAR`.
- Disabled: No disabled primary states.
- Offline/slow network: No network dependencies after static assets load.

## Content voice
- Tone: Energetic but concrete.
- Terminology: “session”, “agenda”, “speaker”, “ICS”, “timezone”.
- Microcopy rules: Say fictional/local-only when describing limits.

## Implementation constraints
- Framework/styling system: `what-framework@0.13.10`, `what-compiler@0.13.10`, Vite 6.4.3, CSS only.
- Design-token constraints: No remote images, paid services or tracking.
- Performance constraints: SSG for every direct content route; small client bundle.
- Compatibility constraints: Node 22; browser APIs behind safe wrappers.
- Test/screenshot expectations: Desktop, mobile, direct route, 404, filter, timezone, storage failure, ICS export.

## Open questions
- [ ] None for local review; live deployment validation belongs to root.

## Refinement notes — 2026-10-01 style audit
- Move away from a toy-like poster graphic and make the agenda density visible immediately.
- Lead with conference IA: next session, topic filters, timezone context and schedule rows should be visible early.
- Keep the citrus/ultramarine identity, but make it feel like a real conference app with fast scanning and useful session hierarchy.

## Refinement notes — 2026-10-02 Opus review
- Filter chips now visibly respond to `aria-pressed`, with focus styles preserved for keyboard use.
- Static and client agendas are grouped by day, and time labels use non-wrapping timezone-aware text on home and agenda routes.
- Static session rows can be whole-card links, but mounted agenda rows use a title/details anchor beside a separate Save button so navigation and saving stay distinct keyboard targets.
