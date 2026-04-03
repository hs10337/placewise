# AGENTS.md

## Purpose
Placewise is a map-first iOS app for discovering why a place matters.

Current MVP scope:
- iOS client built with SwiftUI, MapKit, and CoreLocation
- Supabase backend with Postgres, PostGIS, and Edge Functions
- San Francisco is the only supported city for MVP work

## Product Intent
- The product is for in-the-moment curiosity while walking around a neighborhood or city.
- The core user question is: what is this place, why does it matter, what used to be here, and what is interesting about this spot?
- The app should deliver short, trustworthy, source-backed stories, not exhaustive research or a chat-first experience.
- The experience should feel map-first, calm, elegant, readable outdoors, and informative without becoming academic or gimmicky.

## Primary UX Model
- The map is the exploration surface.
- The bottom sheet is the reading surface.
- The main interaction is pointing at a place and understanding it, not browsing a feed or list.
- Prioritize short answer first, depth second.

## Target Users
- Primary: curious city walkers and neighborhood explorers who want a fast explanation in the moment.
- Secondary: new residents and thoughtful travelers who want richer local context.
- Not the MVP target: academic researchers, itinerary-first tourists, or users seeking exhaustive archival depth.

## MVP Experience
- Home screen is a full-screen map centered on user location.
- Users can tap subtle highlighted places with available stories.
- Users can long-press any map point to ask about an arbitrary location.
- Search should resolve a place name, zoom the map, and open the place brief.
- The core prototype loop is: open map, tap or long-press, resolve location, show a strong place brief, optionally switch lenses.

## Place Brief Requirements
- Each brief should include a place name, one-line hook, short summary, why-it-matters explanation, notable facts, and visible source attribution.
- Keep the default brief tight; deeper lenses handle additional complexity.
- Optional MVP lenses are: History, What used to be here, Architecture / design, and Local significance.
- Only show a lens when real content exists. Do not render empty or fake tabs.

## Resolution And Content Rules
- Resolve to a known place when possible.
- Otherwise fall back to the nearest meaningful place, then to area context if no strong match exists.
- Surface confidence internally and avoid presenting low-confidence matches as precise.
- Be honest when information is limited. Sparse content should still produce a concise answer, but never fabricated richness.
- Small places matter, not just major landmarks.

## MVP Scope Boundaries
- In scope: map-first home screen, user location centering, highlighted places, long-press selection, place brief bottom sheet, short summaries, key facts, source attribution, optional lenses, place-name search, single-city coverage.
- Out of scope by default: multi-city coverage, route generation, audio tours, comments, social features, AR, user submissions, and full conversational AI chat as the primary UX.

## Repo Map
- `apps/ios/Placewise`: iOS app source
- `apps/ios/Placewise.xcodeproj`: Xcode project
- `backend/supabase/functions`: Edge Functions such as `resolve`, `search`, and `place`
- `backend/sql`: schema, extensions, and SQL functions
- `backend/seeds`: seed data
- `docs`: architecture and API contracts
- `scripts`: setup and migration helpers

## Tech Stack and Frameworks
- iOS app: Swift, SwiftUI, MapKit, and CoreLocation
- Backend: Supabase with Postgres, PostGIS, and Edge Functions
- Backend function language: TypeScript
- Database layer: SQL migrations and seed data
- Dev tooling: Make, shell scripts, XcodeGen, SwiftFormat, SwiftLint, and Supabase CLI
- Current repo scope is iOS-native; do not assume a React or shadcn/ui frontend exists unless the codebase changes

## Default Workflow
1. Read `README.md` and relevant docs before changing behavior.
2. Keep changes scoped to the smallest coherent unit.
3. Preserve the locked stack unless the user explicitly asks to change it.
4. Prefer fixing root causes over patching symptoms.
5. Verify with the most relevant local command available.

## Common Commands
- Setup: `make setup`
- Bootstrap env files: `make bootstrap`
- Run DB migrations: `make db-migrate`
- Regenerate iOS project: `make ios-project`
- Format Swift: `make fmt`
- Lint Swift: `make lint`
- Start local Supabase: `supabase start`

## iOS Conventions
- Use SwiftUI patterns already present in `apps/ios/Placewise`.
- Keep UI changes aligned with the map-first interaction model.
- Avoid introducing new third-party iOS dependencies without explicit approval.
- Prefer small, composable view and model changes over large rewrites.

## Backend Conventions
- Keep MVP city filtering intact unless the task is explicitly about expanding scope.
- Put schema changes in numbered SQL files under `backend/sql`.
- Keep Edge Functions narrow: validate input, orchestrate DB calls, and return stable response shapes.
- Preserve API contracts documented in `docs/api-contracts.md` and `docs/repo-blueprint.md`.

## UI and Design System
- Use native SwiftUI components and project-local abstractions as the default foundation.
- Prefer spacious layouts and strong visual hierarchy.
- Use restrained color usage; rely on typography, spacing, and contrast.
- Prefer an 8px spacing rhythm.
- Forms should be short, scannable, and mobile friendly.
- Buttons should have clear primary, secondary, and tertiary hierarchy appropriate to SwiftUI.
- Every interactive element must have visible pressed, focused, and disabled states where the platform supports them.
- Meet accessibility expectations for contrast, labels, Dynamic Type, VoiceOver, and keyboard navigation.

## Change Guardrails
- Do not rename or restructure top-level directories without a clear reason.
- Do not change the locked stack by default.
- Do not broaden geographic scope beyond San Francisco unless requested.
- Do not commit secrets or generated local env files.

## Verification
- Run targeted checks for the area you changed.
- For Swift-only changes, prefer `make fmt` and `make lint`.
- For SQL or Supabase changes, ensure migrations and affected functions stay in sync.
- If you cannot run a meaningful verification step, state that clearly.

## When Unsure
- Ask whether the change should optimize for MVP speed or longer-term architecture.
- Prefer documenting assumptions in the final response when proceeding without confirmation.
