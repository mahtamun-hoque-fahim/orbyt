# BRAIN.md — Orbyt

> This file is maintained by the Singularity skill. It is the identity document of this project.
> When Claude drifts, hallucinates, or loses context — this file is the source of truth.
> Do not confuse this with PLANNER.md (tasks/phases) or DESIGN_GUIDE.md (design tokens).

---

## The One-Line Truth

Orbyt is a dark-mode developer learning tracker — curated web dev phases, per-topic checklists, analytics charts, and daily push notification reminders to keep momentum from fading.

---

## Why It Exists

Most developers learning full-stack web development lose momentum not from inability but from losing track of what they have done, what is next, and how far they have come. Generic to-do apps offer no structure; course platforms offer no flexibility. Orbyt maps an opinionated learning track (HTML/CSS through deployment) to real YouTube channels, tracks completion per phase with granular topic checkboxes, visualizes progress across five chart types, and nudges users back into orbit via push notifications when they go quiet. It is a personal orbit log — not a productivity app, not a course platform.

---

## What It Must Become

The quiet dashboard that is always open alongside a tutorial. A developer finishes a Kevin Powell lesson, opens Orbyt, checks off "CSS Grid," watches the phase bar tick up, and feels the orbit hold. Not impressive — inevitable. When the project is done, no user should be able to articulate why they keep coming back. They just do, because the progress is real and visible and theirs.

---

## Core Decisions (Locked)

These decisions are final. Claude must not question or work around them without explicit confirmation from Fahim.

- [LOCKED] MUI v6 exclusively — no Tailwind anywhere, no shadcn/ui, layout via Box/Grid/Stack/Container only
- [LOCKED] Better Auth email+password only — no OAuth, no Google, no GitHub in v1
- [LOCKED] Three.js dashed wireframe globe in hero section only — not used anywhere else in the app
- [LOCKED] MUI X Charts for all 5 chart types (bar, column, pie, line, area) — no Recharts, no Chart.js
- [LOCKED] progress_log is insert-only — no DELETE route exists or will exist for this table; cascade deletes must never touch it
- [LOCKED] reminder_time stored as HH:MM varchar in UTC — Server Action converts from user local timezone before saving; convert back on display
- [LOCKED] All user-data DB queries filter by user_id derived from server-side session — never from URL param, request body, or client-supplied value
- [LOCKED] Phase slugs are unique per user, not globally unique — never enforce global slug uniqueness
- [LOCKED] MUI Grid v2 syntax only — use `size={{ xs: 12, md: 6 }}` prop, never the legacy `item xs={12}` pattern
- [LOCKED] No localStorage for user data — all progress, notes, settings, and resources persist to Neon
- [LOCKED] v1 is free, no paid tiers — but users table has a plan varchar column reserved for future gating
- [LOCKED] npx tsc --noEmit + npm run build must pass before every push — no exceptions
- [LOCKED] Inter via @fontsource/inter — no Google Fonts CDN
- [LOCKED] lucide-react icons only — no emojis anywhere in codebase or UI

---

## Visual Identity (Locked)

> Chosen from the project brief. These values are locked. Do not substitute or invent values.
> Phase accent colors are intentionally mapped to real technology brand colors — this is a design decision, not decoration.

| Token              | Value      | Usage                                          |
|--------------------|------------|------------------------------------------------|
| `bg`               | `#0a0a0a`  | Page background                                |
| `surface`          | `#111111`  | Card, panel, input backgrounds                 |
| `border`           | `#1e1e1e`  | Default border color                           |
| `text`             | `#f5f5f5`  | Primary text                                   |
| `text-secondary`   | `#888888`  | Secondary / muted text                         |
| `accent-phase-1`   | `#E44D26`  | Phase 1 HTML+CSS (HTML orange)                 |
| `accent-phase-2`   | `#F7DF1E`  | Phase 2 Vanilla JS (JS yellow)                 |
| `accent-phase-3`   | `#61DAFB`  | Phase 3 React (React cyan)                     |
| `accent-phase-4`   | `#3178C6`  | Phase 4 TypeScript (TS blue)                   |
| `accent-phase-5`   | `#EDEDED`  | Phase 5 Next.js (Next.js near-white)           |
| `accent-phase-6`   | `#336791`  | Phase 6 SQL (PostgreSQL blue)                  |
| `accent-phase-7`   | `#C5F74F`  | Phase 7 Drizzle ORM (Drizzle lime)             |
| `accent-phase-8`   | `#FF4500`  | Phase 8 Deployment (Fireship red-orange)       |
| `progress-low`     | `#FFA000`  | Progress bar 0-40% (amber)                     |
| `progress-mid`     | `#FF6D00`  | Progress bar 41-79% (orange)                   |
| `progress-high`    | `#43A047`  | Progress bar 80-100% (green)                   |
| Font (display)     | Inter      | All headings (h1–h3) via @fontsource/inter     |
| Font (body)        | Inter      | Body copy via @fontsource/inter                |

Typography scale (MUI theme):
- h1: 3.5rem, weight 800
- h2: 2.25rem, weight 700
- h3: 1.5rem, weight 600
- body1: 1rem, weight 400
- caption: 0.75rem, weight 400

Motion character: High-motion, professional. Every animation must feel earned.
- Page transitions: opacity 0→1, y 20→0, 0.4s easeOut via AnimatePresence in root layout
- Phase cards: staggerChildren 0.06s, hover scale 1.02 + border glow, tap scale 0.98
- Progress bars: width 0→actual, 0.8s cubic-bezier(0.16, 1, 0.3, 1)
- Checkbox completion: SVG pathLength 0→1 + label strikethrough
- Topic list (AnimatePresence): add = slide down + fade in, delete = slide up + fade out + height collapse
- Settings tabs: AnimatePresence mode="wait" crossfade
- Globe canvas: opacity 0→1 over 1.2s on mount; rotation is native Three.js, not Framer Motion

---

## What It Must Never Become

- Never a social platform — no followers, likes, public profiles, or share links
- Never have a light mode — dark-first, no toggle, no system preference override
- Never use Tailwind, shadcn/ui, or any CSS-in-JS outside MUI's emotion layer
- Never place emojis in code, UI strings, copy, or commits
- Never use double dashes in copy or UI strings
- Never store user progress, notes, or settings in localStorage
- Never use Google OAuth, GitHub OAuth, or any third-party auth provider in v1
- Never delete rows from progress_log — it is an append-only ledger
- Never use MUI Grid v1 syntax (the `item` prop pattern)
- Never derive user identity from URL params or request body — always from server-side session
- Never use Three.js outside the hero GlobeCanvas component

---

## Current State

```
Status: Alpha
Last updated: 2026-09-19

What works:
- Project identity and architecture are locked
- Database schema is fully designed
- All routes and user flows are defined
- Build has not started yet

What's broken or incomplete:
- No code written yet
- Repo exists but is empty (mahtamun-hoque-fahim/commit-mess-tracker)
- No environment variables configured
- No Neon database provisioned

What's next (in spirit, not tasks):
- Scaffold the Next.js 16 app with MUI theme
- Wire Drizzle schema + Better Auth
- Build landing page with Three.js globe
- Build auth flow (login, signup, onboarding)
- Build dashboard and phase detail pages
```

---

## The Stack (Frozen)

| Layer          | Choice                                                  |
|----------------|---------------------------------------------------------|
| Framework      | Next.js 16 App Router, Turbopack                        |
| Language       | TypeScript (strict mode, no `any`)                      |
| UI Library     | MUI v6 (Material UI) — Box, Grid v2, Stack, Container  |
| Charts         | MUI X Charts — bar, column, pie, line, area             |
| 3D             | Three.js — hero globe only                              |
| Animation      | Framer Motion — every component                         |
| Database       | Neon (serverless PostgreSQL)                            |
| ORM            | Drizzle ORM + drizzle-kit                               |
| Auth           | Better Auth — email + password, multi-user              |
| Notifications  | Web Push API + Service Worker + VAPID keys              |
| Cron           | Vercel Cron Jobs (hourly, /api/cron/notifications)      |
| Icons          | lucide-react only                                       |
| Fonts          | Inter via @fontsource/inter                             |
| Deployment     | Vercel (primary only — no Cloudflare for this project)  |

---

## Constraints & Non-Negotiables

- Dark mode only — no light mode, no system preference toggle
- No emojis anywhere in code or UI — lucide-react or hand-rolled SVG only
- No Tailwind — MUI layout primitives exclusively
- No double dashes in any user-facing string or copy
- npx tsc --noEmit must pass before every commit
- npm run build must pass before every push
- Git identity set before every commit:
  ```
  git config user.name "mahtamun-hoque-fahim"
  git config user.email "mahtamunhoquefahim@gmail.com"
  ```
- All DB queries scoped to authenticated user's user_id — never trust client-supplied IDs for data ownership
- .env.local never committed
- CRON_SECRET validated on every cron hit (full header match, not just presence)
- Vercel deploy only — no Cloudflare in this project

---

## Context Hooks (for Claude)

Things Claude tends to forget or get wrong on this specific project. Treat as hard truth.

- **MUI Grid v2:** Use `<Grid size={{ xs: 12, md: 6 }}>`, NOT `<Grid item xs={12}>`. The `item` prop is Grid v1 and does not exist in MUI v6 Grid.
- **Three.js globe:** dynamic import with `ssr: false`. useEffect for init, useRef for mount. renderer.dispose() + window.removeEventListener in cleanup. Framer Motion does NOT animate the globe rotation — that is a Three.js requestAnimationFrame loop only.
- **progress_log insert-only:** toggleTopic(complete=true) → INSERT into progress_log. toggleTopic(complete=false) → update user_topics.completed=false but do NOT delete the log row. The line/area charts depend on all rows being present.
- **reminder_time storage:** Store HH:MM in UTC. The saveNotificationSettings Server Action receives local time + timezone and must call a conversion function before inserting. Display it back in the user's timezone. Never store local time directly.
- **push subscription stale handling:** The cron handler must catch HTTP 410 (Gone) from the push service and DELETE that endpoint from push_subscriptions. Failure to do this causes the cron to loop forever on dead subscriptions.
- **AnimatePresence location:** Must be in the root layout (app/layout.tsx), wrapping `{children}`. Per-page AnimatePresence will not fire page transitions correctly with Next.js App Router.
- **MUI X imports:** Charts come from `@mui/x-charts`. TimePicker comes from `@mui/x-date-pickers`. Never import from the wrong package.
- **Server Actions location:** All Server Actions live in `app/actions/` with `"use server"` at the top of each file — not inline in components.
- **Phase slugs are user-scoped:** When querying `user_phases` by slug, always filter by both `slug` AND `user_id`. Never look up a phase by slug alone.
- **deletePhase cascade:** Deletes user_phases → user_topics → phase_notes + user_resource_links. Does NOT touch progress_log. Enforce at the application layer, not via foreign-key cascade on the DB, to protect insert-only semantics.
- **CRON_SECRET:** Validate with `request.headers.get('authorization') === 'Bearer ' + process.env.CRON_SECRET` — not just `.includes()` or header existence.
- **MUI ThemeProvider:** Must wrap the entire app, including the root layout. Use `"use client"` for the ThemeProvider wrapper component. All page Server Components render inside it.

---

*Last updated by Singularity on 2026-09-19*
