# Foli

A job-portfolio-matching app: candidates build a work portfolio, recruiters post job
alerts, candidates discover and apply to those jobs by swiping or browsing, and a
recruiter accepting an applicant unlocks in-app chat.

## Stack

- Next.js (App Router) + TypeScript, Server Actions for mutations
- Postgres via Prisma 7 (with the `@prisma/adapter-neon` driver adapter — pairs with
  Vercel's serverless functions since it connects over HTTP instead of holding a TCP
  connection open)
- Auth.js v5 (Credentials provider, JWT sessions)
- Tailwind CSS

## Getting started

1. Create a Postgres database (e.g. a free one at [neon.tech](https://neon.tech)) and
   copy its connection string into `.env` as `DATABASE_URL`.
2. Run:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test accounts

Seeded via `npx prisma db seed` (password for all: `password123`):

- `recruiter1@test.com` — recruiter (Northwind Labs)
- `candidate1@test.com` … `candidate4@test.com` — candidates with sample portfolios

## How matching works

Recruiters post job alerts (`/jobs`). Candidates discover jobs by swiping
(`/discover`) or browsing (`/browse`); a "like"/"Apply" creates an `Application`
row. The recruiter reviews applicants per job (`/jobs/[jobAlertId]/applicants`) and
accepting one creates a `Match`, unlocking an in-app chat thread at `/matches`.
Chat is polling-based (no WebSocket infra required).

## Project structure

- `src/app` — routes (App Router)
- `src/components` — UI grouped by feature (portfolio, browse, discover, jobs, chat, nav)
- `src/lib/actions` — Server Actions (account, profile, portfolio, jobAlerts,
  applications, applicants)
- `src/lib/auth.ts` / `auth.config.ts` — Auth.js config (Node-only vs edge-safe split)
- `prisma/schema.prisma` — data model; `prisma/seed.ts` — seed script
