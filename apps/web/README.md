# HagSpot Web

The modern HagSpot application uses Next.js, TypeScript, Supabase Auth, PostgreSQL, Drizzle ORM, and Tailwind CSS.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Public browsing works without credentials. Authentication, bookings, and QR presence require the values in `.env.local` and a configured database.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

## Deployment

Deploy `apps/web` as the Vercel project root. Configure `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the Vercel environment settings. Run the Drizzle migration against the production database before enabling bookings or presence check-ins.

In Supabase Auth, add the production callback URL:

`https://YOUR_DOMAIN/auth/callback`

The legacy PHP/HTML application remains at the repository root during the staged migration.
