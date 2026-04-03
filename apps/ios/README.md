# iOS App Blueprint

## Tech
- SwiftUI for UI
- MapKit for map and tap/long-press interactions
- CoreLocation for user location
- URLSession for API calls
- SwiftData for local caching/bookmarks (optional MVP)

## Suggested Feature Slices
- `Features/Map`: map screen, user location, highlight overlays, map gestures
- `Features/PlaceBrief`: bottom sheet + place detail rendering
- `Features/Search`: search field + result list + map focus
- `Services`: API client, location service, map resolution coordinator
- `Models`: Place/PlaceBrief/Source/Lens/MapSelection DTOs

## Generate Xcode Project
```bash
cd apps/ios
xcodegen generate
```
