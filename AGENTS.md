# Orbyt

Learning tracker for web developers — phase-based progress, analytics charts, and daily push notification reminders to keep momentum from fading.

## Git Identity (Session Start — run before any commit, every session)

```
git config user.name "mahtamun-hoque-fahim"
git config user.email "mahtamunhoquefahim@gmail.com"
```

Execute automatically at the start of every session, before the first commit — never ask, never skip, never commit as Claude. This applies across every Claude account/session working this repo. Claude web sandboxes reset identity between sessions; without this, commits are authored as Claude instead of Fahim.

## Setup and Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit` (must pass before every push)
- DB push (dev): `npx drizzle-kit push`
- DB migrate (production): `npx drizzle-kit generate` then `npx drizzle-kit migrate`
- Seed: `npx tsx scripts/seed.ts`

## Conventions and Non-Negotiables

- No emojis anywhere in code, UI strings, copy, or git commits — lucide-react icons or inline SVG only
- No Tailwind, no shadcn/ui — MUI v6 layout primitives exclusively (Box, Grid v2, Stack, Container)
- MUI Grid v2 syntax: use `size={{ xs: 12, md: 6 }}` prop — the legacy `item xs={12}` pattern is Grid v1 and does not exist in MUI v6
- No double dashes in any user-facing string or UI copy
- No localStorage for user data — all progress, notes, settings persist to Neon
- All DB queries must filter by user_id from server-side session — never from URL params or request body
- progress_log is insert-only — never add a DELETE route or cascade delete through this table
- Phase slugs are user-scoped — always filter by (user_id, slug), never by slug alone
- Server Actions live in `app/actions/` with "use server" at the top of each file, not inline in components
- AnimatePresence must be in the root layout (app/layout.tsx), not per-page — required for App Router page transitions
- Three.js globe rotation uses native requestAnimationFrame, not Framer Motion
- MUI X Charts imports: from `@mui/x-charts`. MUI X TimePicker: from `@mui/x-date-pickers`. Never mix packages
- Better Auth only in v1 — no Google, GitHub, or any third-party OAuth provider
- npx tsc --noEmit and npm run build must both pass before every push

## Security Gotchas

- `.env.local` is never committed — if any secret leaks into git history or chat, rotate it immediately, do not just remove it going forward
- CRON_SECRET: validate with `request.headers.get('authorization') === 'Bearer ' + process.env.CRON_SECRET` — full string match, not just header presence or `.includes()`
- VAPID keys: rotating VAPID keys invalidates all existing push subscriptions. Document any rotation in the session log and notify users. Rotate only on suspected breach
- push_subscriptions can go stale when users reinstall browsers or revoke permission — the cron handler must catch HTTP 410 responses from the push service and DELETE that endpoint row from push_subscriptions
- deletePhase cascade: application-layer cascade only (user_phases → user_topics → phase_notes + user_resource_links). Do NOT cascade into progress_log — it is append-only
- All user-data Server Actions must verify the authenticated user owns the resource before mutating — look up the record first, compare user_id from session

## Session Log

(Newest first. No entry cap — keep all entries forever. Three to four lines per entry. Every entry must include an Agent: field naming the AI or tool that wrote it, so Fahim can trace who did what across sessions.)

### 2026-09-19
- Agent: Claude Sonnet 4.6 (claude.ai)
- Did: Project kickoff — BRAIN.md, SITETREE.md, PLANNER.md, DESIGN_GUIDE.md, README.md, AGENTS.md, CLAUDE.md written. Council PRE-BUILD run in-context, verdict: GO.
- Decided: Full pipeline run (Singularity, tree-man, Council PRE-BUILD, repo-maintainer, task-planner) before any code written.
- Next: Phase 0 — scaffold Next.js 16 app, install packages, create MUI theme, provision Neon, write Drizzle schema.
