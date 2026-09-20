# Orbyt

Learning tracker that keeps developers in orbit. Structured phases, topic checklists, analytics, and daily push notification reminders.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- MUI v6 (Material UI — no Tailwind)
- MUI X Charts + MUI X Date Pickers
- Three.js (hero globe)
- Framer Motion
- Drizzle ORM + Neon (PostgreSQL)
- Better Auth (email + password)
- Web Push API + VAPID + Service Worker
- Vercel Cron Jobs
- lucide-react
- Vercel (deploy)

## Prerequisites

- Node.js 20+
- npm
- A [Neon](https://neon.tech) database provisioned
- VAPID keys generated (`npx web-push generate-vapid-keys`)

## Local Setup

1. Clone the repository
   ```bash
   git clone https://github.com/mahtamun-hoque-fahim/commit-mess-tracker.git
   cd commit-mess-tracker
   ```

2. Set git identity (required before any commit)
   ```bash
   git config user.name "mahtamun-hoque-fahim"
   git config user.email "mahtamunhoquefahim@gmail.com"
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Create `.env.local` from the example
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required env vars — see PLANNER.md § Env Vars for descriptions.

5. Push the Drizzle schema to your Neon database
   ```bash
   npx drizzle-kit push
   ```

6. Run the seed script
   ```bash
   npx tsx scripts/seed.ts
   ```

7. Start the dev server
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npx tsc --noEmit` | Type check (must pass before every push) |
| `npx drizzle-kit push` | Push schema to DB (dev) |
| `npx drizzle-kit generate` | Generate migration SQL |
| `npx drizzle-kit migrate` | Apply migrations (production) |
| `npx tsx scripts/seed.ts` | Seed track + template phases + topics |

## Env Vars

See `PLANNER.md § Env Vars` for full descriptions and examples.

Required: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_VAPID_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`, `CRON_SECRET`

## Folder Structure

```
app/           Next.js App Router pages and API routes
components/    Shared UI components
db/            Drizzle schema and Neon client
lib/           Auth config, push helper, theme, utilities
public/        Static assets + sw.js (Service Worker)
scripts/       DB seed script
```

## Deploy

Deploys to Vercel. `main` branch → production. Configure all env vars in the Vercel dashboard. Add `vercel.json` cron for push notifications (already in repo).
