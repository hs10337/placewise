# Placewise Repo Blueprint

## 1) System Modules
- iOS app (`apps/ios/Placewise`): map interaction, bottom sheet UI, search UI, local cache.
- API layer (`supabase/functions`): request validation and DB orchestration.
- Data layer (`backend/sql`): PostGIS-enabled place entities, search indexes, confidence/resolution functions.

## 2) API Surface (MVP)
- `GET /resolve?lat={lat}&lng={lng}`
  - Returns `exact_place | nearby_place | area_context` with confidence.
- `GET /place/{id}`
  - Returns full `PlaceBrief` + sources + lenses.
- `GET /search?q={term}&city=sf`
  - Returns ranked place matches in San Francisco.

## 3) Data Contracts
- `Place`: `id, name, latitude, longitude, place_type, coverage_type, confidence`
- `PlaceBrief`: `place_id, hook, summary, why_it_matters, facts[]`
- `Source`: `id, place_id, label_type, title, url`
- `Lens`: `id, place_id, lens_type, body`

## 4) Resolution Rules (MVP)
1. If user tap/long-press intersects a known place geometry radius, return `exact_place`.
2. Else return nearest meaningful place within radius threshold as `nearby_place`.
3. Else return `area_context` for containing neighborhood/census area.
4. Always return confidence tier and raw distance for UI wording.

## 5) City Scope
- Only San Francisco records are queryable in MVP (`city_slug = 'san-francisco'`).
- Search and resolve endpoints enforce city filter.
