# Placewise

Map-first iOS app for discovering why a place matters.

## Stack (Locked)
- iOS: Swift + SwiftUI + MapKit + CoreLocation
- Backend: Supabase (Postgres + PostGIS + Edge Functions)
- MVP city: San Francisco

## Repo Layout
- `apps/ios` iOS app code and project config
- `supabase/functions` live local Edge Function runtime code
- `backend/supabase` backend blueprint notes
- `backend/sql` schema, policies, and SQL functions
- `backend/seeds` city-scoped seed data
- `docs` architecture, API contracts, and execution notes
- `scripts` developer setup helpers

## Local Setup
1. Install Xcode from the App Store (full app, not only Command Line Tools).
2. Run `scripts/dev-setup.sh`.
3. Run `scripts/bootstrap.sh` to scaffold local env files.
4. Start local Supabase: `supabase start -x vector,logflare`.
5. Run migrations: `scripts/db-migrate.sh`.
6. Seed San Francisco sample data: `scripts/db-seed.sh`.
7. Serve local functions: `supabase functions serve --env-file .env.local --no-verify-jwt`.

## Verification
- `make fmt`
- `make lint`
- `make ios-build`
- `make test`

`make ios-build` compiles the app for the iOS Simulator without requiring a development team. `make test` runs the unit test target on a local simulator runtime.

## Prototype Milestone
1. Open map in San Francisco.
2. Tap a highlighted place or long-press any point.
3. Resolve place context through `/resolve`.
4. Show place brief bottom sheet.
5. Search place by name and open brief.
