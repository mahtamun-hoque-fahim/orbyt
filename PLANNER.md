# Orbyt — Planner

> Learning tracker that keeps developers in orbit. Phase-based checklists, analytics, and daily push reminders.

## Project Overview

**Purpose.** Self-taught developers learning web development via YouTube tutorials lose momentum not from inability but from invisible progress. Orbyt maps an opinionated full-stack curriculum to real YouTube channels, tracks per-topic completion, visualizes cumulative progress across five chart types, and nudges users back with daily push notification reminders.

**Target user.** A developer learning full-stack web development independently — watching Kevin Powell, Web Dev Simplified, Fireship, and similar channels — who has no structured progress log and falls off orbit between sessions.

**Key value.** Make progress visible. A developer opens the dashboard, sees the phase bar at 62%, checks off "Async and await," watches it tick to 65%, and stays in orbit another day.

**Current phase.** Planning

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router, Turbopack
- Language: TypeScript (strict, no `any`)
- UI Library: MUI v6 (Material UI) — MUI Grid v2 syntax only
- Charts: MUI X Charts (bar, column, pie, line, area)
- 3D: Three.js — hero GlobeCanvas only
- Animation: Framer Motion — every component
- Database: Neon (serverless PostgreSQL)
- ORM: Drizzle ORM + drizzle-kit
- Auth: Better Auth — email + password, multi-user
- Notifications: Web Push API + Service Worker + VAPID keys
- Cron: Vercel Cron Jobs (hourly)
- Icons: lucide-react only
- Fonts: Inter via @fontsource/inter
- Deployment: Vercel (primary, only — no Cloudflare for this project)

**Deployment topology:**
- `main` → Vercel production
- PRs → Vercel preview

**Folder structure (summary):**
```
app/
  (auth)/          → /login, /signup route group
  (app)/           → /onboarding, /dashboard, /phase/[slug], /settings route group
  api/
    auth/[...all]/ → Better Auth handler
    push/
      subscribe/   → POST — save push subscription
      unsubscribe/ → DELETE — remove push subscription
    cron/
      notifications/ → GET — Vercel Cron trigger (hourly)
  actions/         → all Server Actions ("use server" at file top)
  layout.tsx       → root layout: ThemeProvider, AnimatePresence, Inter font
components/
  ui/              → shared MUI-based components
  globe/           → Three.js GlobeCanvas (client, ssr:false)
db/
  schema.ts        → all Drizzle table definitions
  index.ts         → Neon client + Drizzle instance
lib/
  auth.ts          → Better Auth instance
  push.ts          → web-push helper
  utils.ts         → shared utilities
public/
  sw.js            → Service Worker
scripts/
  seed.ts          → insert track + template_phases + template_topics
```

---

## User Flows

### Flow 1: New user registers and picks a track
1. User lands on `/` — sees hero with Three.js globe, how-it-works, track preview, manifesto
2. Clicks "Start your orbit" → `/signup`
3. Enters email + password → Better Auth creates user → redirect to `/onboarding`
4. Onboarding shows two track cards: "Full-Stack Web Development" (recommended) and "Custom Track"
5. User picks Full-Stack → Server Action copies 8 template_phases + all template_topics into user_phases + user_topics → redirect to `/dashboard`
6. Dashboard shows overall progress bar (0 of 74 topics), empty charts (zero-state UI), 8 phase cards

### Flow 2: Returning user checks off a topic
1. User lands on `/login` → signs in → redirect to `/dashboard`
2. Sees dashboard with current progress
3. Clicks "Phase 3: React" card → `/phase/react`
4. Sees topic checklist — checks off "useState"
5. toggleTopic Server Action: updates user_topics.completed=true, inserts row in progress_log
6. Animated SVG checkmark draws, label strikes through
7. Phase progress bar animates to new percentage
8. Dashboard revalidated — charts and overall bar update on next visit

### Flow 3: User enables push notifications
1. User opens `/settings` → Notifications tab
2. Toggles "Enable daily reminder" switch
3. Browser permission prompt fires (client-side)
4. On allow: subscribe to push → POST /api/push/subscribe → saves endpoint + keys to push_subscriptions
5. User sets reminder time (MUI X TimePicker) + timezone
6. Server Action converts local time to UTC → upserts notification_settings
7. Vercel Cron hits /api/cron/notifications hourly → queries users with matching UTC hour → sends push

### Flow 4: Custom track onboarding
1. User picks "Custom Track" on onboarding → Server Action creates no phases
2. Redirect to `/dashboard` → empty state: "You have no phases yet. Add your first phase."
3. User opens `/settings` → Track tab → adds custom phase with name + channel info
4. Redirect to `/phase/[new-slug]` to add topics

---

## DB Schema

Drizzle schema lives in `db/schema.ts`.

### Better Auth tables (managed by Better Auth)
| column | type | notes |
|---|---|---|
| users.id | text PK | Better Auth default |
| users.name | text | display name |
| users.email | text unique | |
| users.emailVerified | boolean | |
| users.image | text nullable | |
| users.plan | varchar(20) | default 'free' — reserved for future gating |
| users.createdAt | timestamp | |
| users.updatedAt | timestamp | |
| sessions, accounts, verifications | — | standard Better Auth tables |

### tracks
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| name | varchar(100) | not null |
| slug | varchar(100) unique | not null |
| description | text | nullable |
| created_at | timestamp | default now() |

### template_phases
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| track_id | uuid FK | → tracks.id not null |
| name | varchar(200) | not null |
| slug | varchar(200) | not null |
| channel_name | varchar(200) | not null |
| channel_url | varchar(500) | not null |
| playlist_url | varchar(500) | not null |
| order_index | integer | not null |

### template_topics
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| phase_id | uuid FK | → template_phases.id not null |
| label | varchar(300) | not null |
| order_index | integer | not null |

### user_phases
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | varchar | not null (Better Auth user id) |
| track_id | uuid FK | → tracks.id nullable |
| name | varchar(200) | not null |
| slug | varchar(200) | not null |
| channel_name | varchar(200) | nullable |
| channel_url | varchar(500) | nullable |
| playlist_url | varchar(500) | nullable |
| order_index | integer | not null |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now() |

*Unique constraint: (user_id, slug) — slugs are user-scoped, not globally unique*

### user_topics
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| phase_id | uuid FK | → user_phases.id not null |
| user_id | varchar | not null |
| label | varchar(300) | not null |
| completed | boolean | default false |
| completed_at | timestamp | nullable |
| order_index | integer | not null |
| resource_url | varchar(500) | nullable |

### user_resource_links
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| phase_id | uuid FK | → user_phases.id not null |
| user_id | varchar | not null |
| label | varchar(200) | not null |
| url | varchar(500) | not null |
| created_at | timestamp | default now() |

### phase_notes
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| phase_id | uuid FK | → user_phases.id not null (unique) |
| user_id | varchar | not null |
| content | text | default '' |
| updated_at | timestamp | default now() |

*One note document per phase per user — enforced by unique constraint on phase_id*

### notification_settings
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | varchar unique | not null |
| enabled | boolean | default false |
| reminder_time | varchar(5) | HH:MM format, stored in UTC |
| timezone | varchar(100) | default 'UTC' |
| updated_at | timestamp | default now() |

### push_subscriptions
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | varchar | not null |
| endpoint | text unique | not null |
| p256dh_key | text | not null |
| auth_key | text | not null |
| created_at | timestamp | default now() |

### progress_log
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | varchar | not null |
| topic_id | uuid FK | → user_topics.id not null |
| logged_at | timestamp | default now() |

**INSERT-ONLY. Never delete rows. This table powers the line and area charts.**

---

## API Routes

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| ALL | /api/auth/[...all] | — | — | Better Auth handler |
| POST | /api/push/subscribe | session | `{ endpoint, keys: { p256dh, auth } }` | `{ ok: true }` |
| DELETE | /api/push/unsubscribe | session | `{ endpoint }` | `{ ok: true }` |
| GET | /api/cron/notifications | Bearer CRON_SECRET | — | `{ sent: N }` |

### Server Actions (app/actions/)

| Action | File | What it does |
|---|---|---|
| `toggleTopic(topicId, completed)` | topic-actions.ts | Update user_topics; INSERT progress_log if completed |
| `saveNote(phaseId, content)` | note-actions.ts | Upsert phase_notes; no revalidation (debounced) |
| `addTopic(phaseId, label)` | topic-actions.ts | Insert user_topics; revalidate /phase/[slug] |
| `updateTopic(topicId, label)` | topic-actions.ts | Update user_topics.label; revalidate /phase/[slug] |
| `deleteTopic(topicId)` | topic-actions.ts | Delete user_topics row; revalidate /phase/[slug] |
| `addPhase(data)` | phase-actions.ts | Insert user_phases; revalidate /dashboard |
| `updatePhase(phaseId, data)` | phase-actions.ts | Update user_phases; revalidate /dashboard + /phase/[slug] |
| `deletePhase(phaseId)` | phase-actions.ts | Cascade: user_phases + user_topics + phase_notes + user_resource_links; revalidate /dashboard |
| `addResourceLink(phaseId, label, url)` | resource-actions.ts | Insert user_resource_links; revalidate /phase/[slug] |
| `deleteResourceLink(linkId)` | resource-actions.ts | Delete user_resource_links row; revalidate /phase/[slug] |
| `selectTrack(trackId)` | onboarding-actions.ts | Copy template data into user tables; redirect /dashboard |
| `saveNotificationSettings(settings)` | notification-actions.ts | Convert local time to UTC; upsert notification_settings |
| `savePushSubscription(sub)` | notification-actions.ts | Upsert push_subscriptions |

---

## Env Vars

| Name | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | yes | Neon pooled connection string | `postgresql://...?sslmode=require` |
| `DATABASE_URL_UNPOOLED` | yes | Neon direct connection (migrations) | `postgresql://...?sslmode=require` |
| `BETTER_AUTH_SECRET` | yes | Session signing secret (32+ chars) | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | yes | Public app URL | `https://orbyt.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | yes | Same as above, client-readable | `https://orbyt.vercel.app` |
| `NEXT_PUBLIC_VAPID_KEY` | yes | VAPID public key (client-readable) | `BHj3...` |
| `VAPID_PRIVATE_KEY` | yes | VAPID private key (server only) | `---BEGIN EC...` |
| `VAPID_EMAIL` | yes | Contact email for VAPID | `mailto:you@example.com` |
| `CRON_SECRET` | yes | Authorization token for cron route | random 32-char string |

---

## Timeline / Phases

### Phase 0 — Foundation
Status: `[ ]` pending

- [ ] Run: `npx create-next-app@latest orbyt` (Next.js 16, TS, App Router, Turbopack, no Tailwind)
- [ ] Install all packages (MUI, MUI X, Three.js, Framer Motion, Better Auth, Drizzle, web-push, lucide-react, @fontsource/inter)
- [ ] Create MUI dark theme file with 8 phase accent colors + typography
- [ ] Set up Neon database, configure DATABASE_URL + DATABASE_URL_UNPOOLED
- [ ] Write db/schema.ts (all tables)
- [ ] Run first Drizzle migration
- [ ] Write and run seed script (track + template_phases + template_topics)
- [ ] Configure Better Auth (lib/auth.ts + /api/auth/[...all]/route.ts)
- [ ] Write /public/sw.js (Service Worker)
- [ ] Write middleware.ts (protect all routes except /, /login, /signup, /_next, /api/auth)
- [ ] Set up root layout.tsx with ThemeProvider wrapper + AnimatePresence + Inter font
- [ ] Populate .env.local and .env.example

### Phase 1 — Landing + Auth Pages
Status: `[ ]` pending

- [ ] Landing page `/` — Hero (Three.js GlobeCanvas), How it works, Track preview, Manifesto, Final CTA
- [ ] GlobeCanvas component (Three.js, dynamic import ssr:false, client component)
- [ ] Login page `/login`
- [ ] Signup page `/signup`

### Phase 2 — Onboarding
Status: `[ ]` pending

- [ ] Onboarding page `/onboarding` — track selection cards
- [ ] selectTrack Server Action — copy template data into user tables
- [ ] Redirect guard: if user already has phases, redirect to /dashboard

### Phase 3 — Dashboard
Status: `[ ]` pending

- [ ] Dashboard page `/dashboard`
- [ ] Overall progress bar component (animated, gradient: amber/orange/green)
- [ ] BarChart — topics completed per phase
- [ ] ColumnChart — phase completion percentage
- [ ] PieChart — NOT STARTED vs IN PROGRESS vs COMPLETED split
- [ ] LineChart — cumulative topics completed over time (daily, from progress_log)
- [ ] AreaChart — same data, filled
- [ ] Phase cards grid (MUI Grid v2, 2-col desktop, 1-col mobile)
- [ ] Phase card component: name, channel name, X of Y topics, progress bar, status badge, glow on IN PROGRESS

### Phase 4 — Phase Detail
Status: `[ ]` pending

- [ ] Phase detail page `/phase/[slug]` — resolve slug by (user_id, slug)
- [ ] Topic checklist with animated SVG checkbox (pathLength 0→1)
- [ ] toggleTopic Server Action
- [ ] addTopic / updateTopic (inline edit on hover) / deleteTopic Server Actions
- [ ] Resource links section (chips with external link icon)
- [ ] addResourceLink / deleteResourceLink Server Actions
- [ ] Phase notes (MUI TextField multiline, 800ms debounce, saveNote Server Action, saved indicator)
- [ ] Danger zone accordion — deletePhase Server Action

### Phase 5 — Settings
Status: `[ ]` pending

- [ ] Settings page `/settings` with MUI Tabs
- [ ] Notifications tab: enable toggle, MUI X TimePicker, timezone dropdown, permission request flow, savePushSubscription
- [ ] Profile tab: display name edit, email (read-only), change password
- [ ] Track tab: rename phases inline, reorder (drag handle), delete phase (confirm), add custom phase (modal)

### Phase 6 — Push Notifications + Cron
Status: `[ ]` pending

- [ ] /api/push/subscribe route (POST — save subscription to push_subscriptions)
- [ ] /api/push/unsubscribe route (DELETE — remove subscription)
- [ ] /api/cron/notifications route (GET — CRON_SECRET validated, send push to eligible users)
- [ ] vercel.json with cron schedule "0 * * * *"
- [ ] web-push helper in lib/push.ts
- [ ] Stale subscription cleanup (handle 410 responses from push service)

### Phase 7 — Polish + Launch
Status: `[ ]` pending

- [ ] Run motion-hive (animation audit)
- [ ] Run waterborne (emoji sweep)
- [ ] Run sentinel (security audit — multi-user SaaS)
- [ ] Run airborne (SEO — landing page must rank)
- [ ] Run humanizer (all copy)
- [ ] Run cave-man (image opportunities in landing)
- [ ] Run council POST
- [ ] Run gh-meta RELEASE
- [ ] Run ticket-checker
- [ ] Deploy to Vercel

---

## Next Steps

In order:
1. Run `npx create-next-app@latest orbyt` with Next.js 16, TypeScript, App Router, Turbopack, no Tailwind
2. Install all packages from the build order in the kickstart
3. Create MUI theme file (`lib/theme.ts`) with the 8 phase accent colors and typography scale
4. Provision Neon database, set DATABASE_URL and DATABASE_URL_UNPOOLED
5. Write `db/schema.ts` with all tables from the schema plan

---

## Notes and Decisions

**2026-09-19.** Stack locked via kickstart prompt before any code was written. MUI v6 chosen over Tailwind to provide structured layout primitives without class-name juggling. Better Auth chosen for email+password multi-user support with Drizzle adapter. Three.js globe is a deliberate visual differentiator on the landing page — hero engagement, not decoration. progress_log is insert-only by explicit design decision; deletion would corrupt the cumulative chart data.
