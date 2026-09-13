# Security Notes

- Authentication uses Supabase SSR sessions and server-side `getUser()` checks.
- Booking and presence mutations run in server actions; clients never receive database credentials.
- Booking overlap checks are performed server-side.
- Presence records expire after 20 minutes and can be ended early.
- Heatmap output is aggregate only; names and identities are never rendered.
- The app denies browser geolocation and camera permissions through `Permissions-Policy`.
- Redirect targets are restricted to local paths to prevent open redirects.
- Do not commit `.env.local`, Supabase keys, database URLs, or production credentials.
- Configure Row Level Security in Supabase before production data is enabled. Policies should allow users to manage only their own profiles, bookings, and presence records while permitting aggregate occupancy reads.

Before production deployment:

1. Apply the Drizzle migration to the production database.
2. Enable and test Supabase Row Level Security policies.
3. Configure the Supabase production callback URL.
4. Review `npm audit --omit=dev` output.
5. Verify booking conflict behavior with concurrent requests.
