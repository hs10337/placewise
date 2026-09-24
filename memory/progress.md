# Progress

## 2026-09-10: Initialization and discovery

Read the user's pasted B.L.A.S.T. protocol. Inspected the working tree and confirmed the project had no files outside `.git` before initialization.

Created the project constitution and four memory documents. Marked the Blueprint unapproved and the data schemas undefined. No execution logic, probe scripts, credentials, external integrations, or automations were created.

Asked the North Star question and recorded the answer: "prototype is done, landing page is done". Asked integrations and source of truth individually; recorded "tbd" for each as an unresolved decision. Asked the delivery-payload question next; awaiting its answer.

### Verification

Verified that all five required documents exist and are nonempty, that no `execution/` directory exists, and that the file inventory contains only the requested initialization documents outside `.git`. No application tests or connectivity probes have run because no implementation is authorized yet.

The staged document whitespace check passed. An independent read-only review found no contradictory approval, schema, or completion claims.

One-line document check: `test -s CLAUDE.md && test -s memory/task_plan.md && test -s memory/findings.md && test -s memory/progress.md && test -s memory/decisions.md`.

### Errors and results

The initial file search returned exit code 1 because there were no project files to list. Git status reported a clean `main` tracking `origin/main`. This was not an application failure.

### Next step

Continue discovery one question at a time. Execution remains blocked by the Blueprint gate.

## 2026-09-12: Align landing-page brief with the evolving PRD

Read `docs/product.md` and updated `landing_page_principles.md` to reflect map selection, place-specific questions, sourced answers and follow-ups. Kept North America as the initial audience/example lens while preserving worldwide point selection. Distinguished the current account-free web prototype and browser-local history from later native iOS accounts and sync.

The PRD now explicitly governs product scope and claims in the landing-page brief. Re-read it before build milestones and final copy review because the user is editing it in parallel. Preserve those edits; this task did not modify the PRD. Visual research continues to guide presentation. No landing-page implementation started in this alignment step.

Verification: read the revised brief against the PRD's current scope, fallbacks and non-goals. One-line document check: `test -s docs/product.md && test -s landing_page_principles.md && test -s outputs/competitor-website-executive-summary.html && git diff --check`.

## 2026-09-12: Interactive landing-page directions

The user authorized beginning the website and requested options before selecting a direction. Read the frontend skill, current PRD, landing principles and draft design-system notes. Created three interactive visual studies in `outputs/design/directions.html`: Field Notes, Living Atlas and Open Window. The comparison includes the same sourced San Francisco example, selectable places and follow-up answers. `outputs/design/directions.md` records visual theses, page structure, interaction ideas, tradeoffs and proposed library choices.

Recommend Field Notes with a restrained spatial transition inspired by Living Atlas. No final visual direction, production architecture or map-provider integration was committed. Preserve the PRD being edited in parallel. Full landing-page implementation follows the user's direction choice.

Verified all directions at desktop and phone widths, source image loading, selection and follow-ups, keyboard tab switching and CTA focus. JavaScript syntax passed; final browser logs showed no errors. See `outputs/design/qa.md` for results and limitations. A direct file-URL browser check was blocked by browser policy; the existing localhost preview remains available on port 8766 and serves only `outputs/design`. No deployment occurred.

The final PRD recheck caught concurrent changes confirming preference-based area discovery, editable groups of up to five suggested places and local exploration history. Updated the landing principles, direction brief and review-page scope note accordingly. The studies remain explicitly focused on the direct-place moment; the selected full landing page must show both exploration paths. The PRD itself was not edited.


## 2026-09-14: Primland-inspired Placewise landing page

The user requested a complete landing page inspired by `landing-page/example-page.html` and `landing_page_principles.md`, then explicitly confirmed the Placewise name. Built a React/TypeScript/Vite page with atmospheric Telegraph Hill photography, editorial typography, both exploration entry paths, a three-place interactive demonstration, linked evidence, FAQ and working CTAs. Demo questions are curated rather than live AI, with browser-local state, separate conversations, interest updates, kept/removed places and reset. The downloaded reference is preserved.

During final QA, the concurrent “Awesome design” task was found editing the parent landing-page implementation. Preserved this complete direction separately at `landing-page/primland-inspired/` to avoid overwriting that work. Its running preview is http://127.0.0.1:5175/. The parent folder remains available to the alternate task.

Strict TypeScript and production build pass. Browser checks covered 1440, 1280, 820, 390 and 320 widths, image/font loading, mobile navigation and Escape focus return, FAQ keyboard expansion, source-backed follow-ups, per-place state, reload persistence, exclusion across refreshes and empty-group recovery. Fixed mobile Reset access, the 320px horizontal overflow, live-region remounting and the main landmark. Details and limitations are in `landing-page/primland-inspired/QA.md`. No deployment or live product integrations were added.

## 2026-09-14: iPhone mockup and design-system HTML

The user requested a two-page HTML preview and clarified that the mockup represents the Placewise iPhone app. Created a separate studio entry in `landing-page/src/studio/`, reusing the current Teal Mist theme, shadcn/ui primitives, illustrated map, and sourced examples. The existing landing page remains available.

Delivered `outputs/placewise-studio/index.html`, with JavaScript and CSS inline, and a local preview at http://127.0.0.1:5177/. The mockup covers area exploration, explicit interest updates, place-specific prepared questions, drafts and saved places. The second page provides design tokens and interactive component specimens. Font and photograph require the network; this is a browser design mockup, not a native app or live AI service.

TypeScript and the studio production build pass. Browser QA covered desktop, 390px and 320px, page navigation, map selection, search recovery, interests, saved state, reload persistence, keyboard focus recovery, swatch copying and accordion behavior. Fixed filtered-pin focus return, hidden search queries and follow-up focus. Final browser warning/error logs were empty. Build and verification details are in `outputs/placewise-studio/README.md`. No public deployment was performed.

## 2026-09-14: Approved brand token foundation

The user selected Glacier + Oxblood with pure white reading surfaces and Bricolage Grotesque / Instrument Sans, then requested primitive and semantic tokens in light and dark modes. Added a canonical JSON token source, typed reference resolver, generated CSS and a generator/checker. Shared roles cover typography, spacing, radius, sizing, focus, motion and elevation; color roles adapt by mode. No component token layer was added.

Updated the shared theme, Studio appearance selector and source-driven design-system page. The local port 5177 artifact and `docs/design-system.html` were rebuilt. Updated brand and implementation documentation, retained legacy aliases for compatibility, fixed map-control contrast and corrected a 320px shadow-specimen overflow.

Studio and landing-page builds pass. All 28 declared contrast pairs pass per mode; the lowest text ratio is 5.23:1 light and 5.58:1 dark. Browser review covered theme selection and persistence, resolved colors, interactive specimens, desktop and 390/320px layouts. Final browser warning/error logs were empty. See `outputs/placewise-studio/QA.md` for exact checks and remaining legacy-component scope. No Figma changes or public deployment were made.

## 2026-09-14: Revised design-system documentation skill

The user updated the design-system skill and requested that the existing reference follow it. Replaced the long reference page with a Primer-style sidebar and 14 stable pages, a persistent sidebar Light/Dark switch, System fallback, and an accessible mobile menu. Preserved approved tokens and typography. Added starter icon/control coverage, separate UI and scenario patterns, complete token metadata and a deterministic Figma-ready export. Missing shared control APIs are labeled; component tokens remain deferred.

The documentation build now packages actual source links and a token download with freshness hashes. Updated `docs/DESIGN_SYSTEM.md`, both generated HTML files and the Studio README. Figma remains not configured; no external writes or recurring jobs were created.

TypeScript, studio build, 192-record export validation, contrast and artifact-freshness checks pass. Browser checks covered all 14 routes at 320px without page overflow, both themes, preserved sidebar position, keyboard controls, form recovery, menu focus wrapping/Escape and skip navigation. Fixed a native dialog backward-tab escape. Final browser warning/error logs were empty. Verification details are in `outputs/placewise-studio/QA.md`.


## 2026-09-14: White canvas refinement

The user requested less Glacier across the app and website canvas. Changed light --background to pure white and --accent to glacier-50 (#F4FAFB). Secondary surfaces retain the same faint Glacier tint; stronger Glacier remains in compact hover/pressed states and accents. Text selection uses the stronger secondary-active/secondary-foreground pair so it stays visible. Dark palette and typography are preserved. Updated brand guidance, implementation docs and the Colors reference, then regenerated CSS, token exports, both HTML artifacts and source snapshots.

Studio and landing-page production builds pass, as do 28 contrast pairs per mode and all token/export/artifact freshness checks. Browser review confirmed white page/header/app surfaces, faint sidebar and selection surfaces, the existing dark palette, no mobile overflow, working mobile menu Escape/focus return and empty warning/error logs. The existing preview is left on Colors in light mode at http://127.0.0.1:5177/#ds-colors.


## 2026-09-14: Complete primitive color reference

The user reported that the dark-theme colors were missing from the primitive palette. Audit confirmed all 43 dark semantic color records already resolve to 23 existing primitive colors; the four-swatch overview was incomplete. Replaced that overview with all 41 color primitives grouped into ramps, with independent All / Used in Light / Used in Dark filtering. Usage labels follow actual alias chains, including shared roles, and distinguish the three unused palette shades. The Colors token table now defaults to Primitive and separates invariant values from actual theme use. No token values or identities changed.

Regenerated both HTML references and source snapshots, and updated the implementation guide. Studio build, 192-record export, mode parity, 28 contrast pairs per mode and freshness checks pass. Browser review confirmed 41 total / 21 light-used / 23 dark-used colors, correct dark Slate and Oxblood values, independent appearance switching, keyboard filtering, mobile menu focus recovery and no page overflow at 320px. Fixed a mobile flex-basis gap found during review. Preview is left on Colors in Dark appearance with Used in Dark selected.
# 2026-09-14: Current iPhone wireframe in Studio

The user requested a page linking the current mockup and the design system for continued iteration. Reused the existing two-page Studio, replaced its earlier phone study with the current iPhone map/bottom-sheet/place/conversation flow, and simplified the surrounding page copy. Added screen shortcuts outside the phone, shared semantic styling, separate per-place questions/drafts and scoped preferences under a new mockup storage key. Both pages remain mounted so a reference visit does not erase the current mockup interaction.

Rebuilt `outputs/placewise-studio/index.html`, the companion `docs/design-system.html`, and their packaged sources. The local workspace is served at http://127.0.0.1:5177/#mockup, with the reference at #design-system. Updated Studio documentation and QA. The existing landing page and design-system token values were preserved.

Verification: Studio TypeScript/build passed; 192-token export and 28 contrast pairs per theme passed; packaged-source/artifact freshness passed. Browser QA confirmed page links, desktop light/dark, mobile layout, a draft surviving a design-system visit, submitting a question, Recent, and reload persistence. Search, refinement and answers remain explicitly illustrative. No public deployment or native app build was performed.


## 2026-09-15: Revise the iPhone wireframe for photo questions and walks

User approved revision after discussing three scenarios: selecting a building beside Grand Central, photographing the sculpture above its clock, and creating a neighborhood walking route. Reworked Mockup.tsx and scoped CSS around one map/question workspace, sample photo review, subject-specific conversations, a two-step planner, editable route preview, active walking and Recent. Kept a restrained phone composition with shared tokens, a persistent composer, subject attachments and a route-start action fixed below the scrolling stop list.

Route drafts and active walks remain independent. Corrected draft transfer between subjects, route preferences resetting edited stops, inaccessible saved plans when a previous walk existed, repeated screen-shortcut cancellation loops, and internal mobile scrolling. v3 state preserves the previous v2 study. Updated the Studio README and design-system iteration guidance to identify the new flows and the scope difference from the earlier PRD.

Production Studio build, TypeScript and design-system checks pass. Browser verification covered all three flows, draft and paused-walk persistence, detours and return, route edits, end/resume/finish, shared-page navigation, light/dark and 320px widths. Detailed evidence is in outputs/placewise-studio/QA.md. Static preview remains at http://127.0.0.1:5177/#mockup with the revised map home, no QA data, and the user's Light appearance restored. No live camera, routing or AI services were connected.


## 2026-09-15: Strip the wireframe back to basic boxes

User explicitly rejected added detail and asked for no explainers, screen shortcuts, or top navigation. Removed those elements, Studio intro/footer, decoration and detailed answer copy. Mockup.tsx retains the three interaction paths with plain labels and placeholder boxes; ios-wireframe.css now uses grayscale square borders. Studio.tsx is a minimal page container. Updated reference/README descriptions. Build and token/artifact checks pass; verified desktop composition, photo/planner interactions and 320px overflow. User state preserved.


## 2026-09-15: Map as primary workspace

Applied the user's annotated changes: map fills the available phone area; bottom becomes a compact Photo/Message/Send composer with no planning buttons or Ask title. Moved Plan into a small map control that opens or resumes the existing plan. Chat retains a visible map. Build/checks pass; verified Plan navigation and 320px layout. Recommended map as shared workspace and plan as an attached route, with place questions distinct from itinerary edits.


## 2026-09-15: Move secondary actions into a left menu

Applied annotated feedback: Plan and Recent now live in a plain left drawer, with Recent visually secondary. The composer uses + for photo attachment. Map-first basic-box layout is preserved. Final build/checks and browser navigation/focus checks pass; saved state unchanged.

## 2026-09-15: Connect a real map to the wireframe

User requested a real map API in the existing map area. Added Leaflet 1.9.4 and OpenStreetMap raster tiles without a key, plus a single-purpose LiveMap.tsx. Graybar, Grand Central and Chrysler markers attach the existing chat subjects. Shared Button primitives render through portals; pan/zoom, visible attribution, tile retry, resize handling and viewport preservation are implemented. The compact composer and left menu remain unchanged. Map labels are live OSM data; subject matching, camera, routes and answers remain wireframe examples.

Updated README and design-system guidance, rebuilt the standalone HTML/source snapshots, and passed TypeScript/token/artifact checks. Browser verified loaded tiles, click/Space selection, zoom, keyboard pan, camera return, walk/chat resizing and 320px layout with no overflow or browser errors. Vite's combined-bundle size advisory is documented in QA. Restarted port 5177 and left a fresh working preview tab marked as a deliverable because the old tab was stuck on a connection-error page. No conversation or walk data was reset.

## 2026-09-15: Apple Maps setup and centered mockup page

User requested Apple Maps and the page structure from another local app at port 3000/app. Inspected that reference in the browser and matched its centered heading/actions/theme selector and iPhone frame. Kept the Placewise phone interface minimal, added a design-system return link, and made the preview's theme selector affect the grayscale phone. Reset mockup remounts with fresh current-study state only when clicked.

Replaced Leaflet with Apple's official MapKit loader and MapKit JS 6. Token configuration is `VITE_APPLE_MAPS_TOKEN` in `landing-page/.env.local`; added an empty example and environment Git ignore rules. No token was found or supplied, and a question requesting its local path/setup is pending. The integration compiles but live Apple map behavior remains unverified; the current map is a plainly labeled placeholder with an external setup link. No sample credentials or fallback maps were used.

Build, token/artifact checks, light/dark browser review, design-system navigation, menu/photo paths and narrow layout pass. Existing user state was preserved. During work, user asked if Mapbox is free; verified its current 50,000 monthly web map-load and 25,000 mobile MAU free tiers at mapbox.com/pricing, and explained paid usage beyond them and separate search/navigation pricing. That question did not explicitly authorize switching providers. Port 5177 remains the working preview.


### 2026-09-15: Mapbox mockup and visual polish

Switched the requested browser mockup to Mapbox GL JS 3.30.0 with the user-supplied public token in ignored landing-page/.env.local. Live Light/Dark maps now work with three selectable subjects around Grand Central. Polished the existing phone/page using warm neutrals, burgundy accents, full-bleed map, rounded floating controls, compact icon composer and a restrained left drawer. Preserved the user's minimal flow and page composition. Plan/Recent remain in the drawer; photo, route and answer logic remain simulated.

Final build, TypeScript, design-system tokens/contrast and artifact freshness pass. Browser checked live tiles, selection, zoom, photo/cancel, map/chat, active-walk entry, menu focus, DS return, both themes and 320px width. All three markers fit after reducing initial zoom to 15.5. No new final browser errors or warnings. Existing study retained; preview left at http://127.0.0.1:5177/#mockup in Light, home, empty composer and no selection. JS bundle is about 2.3 MB minified due to Mapbox and its worker, acceptable for the current standalone prototype.


### 2026-09-15: Approved conversation menu implemented

Implemented Resume walk / Plan a walk / typed recent previews / View all. Conversations now own their route, draft, attachment context and progress under v4 storage; valid v3 data migrates without deleting the original. Chat can generate a route and become a Walk while retaining its questions. Walk history opens routes with their conversation accessible. New menu plans stay independent; starting another walk pauses the old one, and Resume restores its saved stop.

State migration tests 11/11 pass, Studio build/TypeScript and design-system checks pass. Browser QA on separate localhost origin verified the main changed flows, independent walks, reload, mixed history, narrow layout, keyboard focus and both themes with no console warnings/errors. User 127.0.0.1 study remained intact. Updated .design/review-report.md marks MENU-01 resolved and records exact verification limits.

### 2026-09-15: New chat in the drawer

Added the requested New chat action in a pinned bottom-right drawer footer. It creates a blank conversation on the map and focuses Message, preserving existing history and active walk. Build, TypeScript and design-system checks pass. Browser checked empty composer/focus, preserved history and Resume, keyboard focus wrap and 320px fit with a 44px button; no warnings/errors. Main preview is refreshed with the menu open. No other screens redesigned.


### 2026-09-15: iOS place-to-chat flow

Implemented double-click/long-press location context, expanded composer with desktop iOS-style keyboard, sent-message conversation expansion, persistent follow-ups and map-first reopening with saved history. Added coordinate validation/deep copies and reopen-state tests (17 total passing). Replies are marked samples with source links. Unknown points retain coordinates without claiming identification. Existing walk/menu functionality remains.

Browser verified the full desktop flow, reload/history recovery, coordinate selection/removal, 320px keyboard layout and dark theme, with no warning/error logs. Native touch/OS keyboard behavior remains unverified. Dependency file reads stalled in the original tree; built successfully in a temporary copy using the locked npm dependencies, then copied generated outputs back. Main 5177 tab refreshed at map home with the user's walk/history preserved.


2026-09-16: Connected rendered Mapbox labels to named chat context, including metadata persistence, same-place identity and coordinate fallback. Removed persistent place bubbles and retained only the selected pin. Grand Central selection, sample response, saved-history restoration and fallback verified in browser; 29 tests and Studio build pass.
# 2026-09-16: Draggable chat sizing, subsequently withdrawn

Opened the app and scoped the work with the user to opening and sizing over the map. The user selected compact, half-height and expanded draggable positions. Added a 44px drag handle, click and keyboard sizing, explicit expand/collapse controls, measured sheet/composer/keyboard bounds, and short reduced-motion-aware snap transitions. Kept the existing phone style and map integration. Expanded retains 180px of map; camera/planner/walk layouts remain in their existing flow. Sheet position is transient; draft, history and reading position survive collapse.

Fixed review findings around near-compact toolbar overflow, cancellation click suppression, Escape during dragging and focus recovery from full-height views. The typing area grows to 120px and long context labels are capped visually to keep the composer inside narrow phone layouts. Full context remains in accessible text and title tooltips.

TypeScript and Studio build passed in a temporary copy using the existing matching-lockfile dependencies after the original dependency read stalled. All 22 existing state/map-place tests passed. Browser checks on a separate 5180 origin covered pointer dragging, keyboard sizing, long conversation reading position, follow-ups, reload/history/draft recovery, camera focus, light/dark and 320px layouts, including long photo context plus a maximum-height draft. No final browser warning/error logs. Native touch/OS keyboard and browser pointer-cancellation simulation remain outside verified coverage. Main 5177 artifact refreshed and left at half-height with existing user data and Light preference retained. See outputs/placewise-studio/QA.md.


2026-09-16: Added simulated current-location dot and heading cone, compass reset and recenter to the Mapbox mockup. Recenter preserves bearing; map rotation is retained across conversation viewport copies. Verified panning, recentering, rotation/north reset and compact180px map control layout in light/dark. Location is simulated near Grand Central; no GPS permissions requested.

### 2026-09-16: Restore previous chat interaction

The user rejected the draggable chat and requested a revert. Restore the previous automatic compact, typing and conversation states. Updated the current interaction documentation and marked the draggable design as withdrawn. The separate location, compass and recenter work remains in scope to preserve. Reverted the implementation and rebuilt the Studio with the current map work preserved. TypeScript/build and packaged-source freshness checks passed. Browser verification confirmed no drag handle, the original 88px typing area with keyboard, the 66% conversation after Send, and Back to map. Refreshed the main 5177 app at the compact map with existing user data retained. Earlier results above describe the withdrawn implementation.


## 2026-09-16: Keep the composer compact on focus

Applied the user’s precise correction: Message focus opens the keyboard without expanding the home sheet, changing its shape or adding a collapse toolbar. One and two displayed lines fit the existing 54px composer row. The third line grows the row; the textarea caps at 120px and then scrolls. Actual wrapping is measured on draft and width changes. Sent-conversation behavior and the separate map work are preserved.

TypeScript/Studio build and artifact freshness passed. Isolated browser checks measured the sheet at 79px before focus, after focus and through two lines; three lines produced 101px, returning to two restored 79px. Checked soft wrapping, manual line breaks, deletion, width reflow at 320px, long-text scrolling at 120px, and sending into the existing 66% conversation. No page overflow or browser warnings/errors. Main preview refreshed; user history and drafts were not used for testing. Native OS keyboard behavior remains unverified.

## September 16: Chat without an attachment

Removed place/route gating from Send and Enter. Nonempty messages without a selected place or photo snapshot the current neighborhood, Around Grand Central in this simulated location, into each question. Explicit attachments retain precedence; removing context uses the neighborhood for subsequent messages. Saved history preserves neighborhood context, and older v4 data still loads. The compact composer is unchanged. Validated 25 state tests, TypeScript/Studio build, browser Send/Enter, blank-message rejection, reload/history and photo removal fallback.

## September 16: Voice input in the compact composer

An empty or whitespace-only draft now shows a microphone instead of disabled Send. Browser SpeechRecognition/webkitSpeechRecognition fills the editable draft with interim/final text, with Stop until completion and no automatic send. Manual typing, navigation, menu, Escape, backgrounding and unmount cancel the session; callbacks are isolated to their original conversation. Errors recover inline. Browser QA used a temporary fake recognition fixture on port5180, without capturing actual microphone audio: verified mic/send switching, unchanged 54px compact row, corrected and multi-segment transcripts, trailing final after Stop, stale callbacks, early Stop, permission/no-speech/unsupported/start errors, 500-character cap and120px height, then explicit Send with neighborhood fallback. TypeScript and Studio build pass. Live microphone service/device behavior remains unverified.

## September 16: Camera, Photo and File modal

Composer + now opens a centered modal with Camera, Photo and File. Camera retains the existing sample-capture flow. Native photo/file pickers attach sanitized local metadata to the current conversation without losing its draft. Uploaded attachments have independent identity and immutable sent snapshots; no bytes are uploaded or parsed. Added inert background, keyboard focus trap, Escape/backdrop/close dismissal and focus return. Verified 29 state tests, TypeScript/Studio build, native test photo and file selection, retained draft, saved sent metadata after removal/reload, light/dark appearance and 320px layout with 55×88px choices and no horizontal overflow. Rebuilt packaged preview.


2026-09-16: Changed the attachment modal to the user-requested mobile vertical list, anchored above +. Camera/Photo/File are 56px rows with leading icons. ResizeObserver follows composer and phone sizing; existing picker and camera actions remain. Verified short/long drafts, chat, 320px width, both themes, focus trap and dismissal. Rebuilt Studio and documentation, including the iOS/mobile-first product.md update.


2026-09-16: User requested Apple components in Placewise, then explicitly excluded typography/color changes. Preserved all existing font and palette values. Applied component-only capsule/circular buttons, grouped duration radios/interests checkboxes with trailing checks, Coffee switch and anchored menu keyboard/motion behavior. Docs now record the component-only boundary and official Apple references. No Apple font/symbol binaries or native framework imported. Built/published and verified mobile/keyboard behavior plus identical computed brand styling.


## 2026-09-16: Ionic iOS controls in browser prototype

User selected keeping the browser prototype, with Apple-style components but no typography or palette changes. Added @ionic/react 9.0.4 and shared IosButton/focus helpers. App/map actions now use IonButton; composer IonTextarea; photo location IonInput; attachment rows IonList/IonItem; duration IonRadioGroup/IonRadio; interests IonCheckbox; Coffee IonToggle. Native select pickers, Mapbox, phone-contained sheet/dialog shells, and desktop keyboard simulation remain. Documentation identifies Ionic as third-party web components, not UIKit/SwiftUI.

Validation: TypeScript and standalone build passed in an isolated dependency tree; all 36 existing map/state tests passed. Design-system checks passed with 192 unchanged tokens and 28 contrast pairs per theme. Browser QA verified compact focus, two displayed lines at 54px composer height, third line at 76px, one submission with neighborhood fallback, camera/photo location field, radio arrow selection, checkbox/toggle updates, route/walk flow, shadow-button focus rings, New chat autofocus, and attachment focus/arrow/Home/End/Tab/Escape behavior. The attachment list stayed inside the phone at a 320px viewport with its 8px gap above the composer. Light/dark styling retains the original font and palette values. Fixed initial custom-element focus timing, history selection styling, Resume walk wrapper layout, and Ionic toggle content-box sizing. Live microphone transcription was not re-run during component QA.

## September 24: New iOS 18 mockup foundation

Applied `ios-web-foundation` before product screens. Added a separate React preview entry with semantic iOS roles mapped onto the Placewise theme, the full iOS typography vocabulary, `IOSScreen`, `IOSNavBar`, separable phone framing, and reused Ionic actions, lists, toggles, and popover behavior. Verified individual Figma navigation/button/list contexts and retained local status assets. Added development/build commands and updated design-system documentation.

Cloud-offloaded installed dependencies stalled the initial checks. A temporary local install using the existing lockfile unblocked the focused TypeScript and production build. Desktop and 320/390/430px browser checks covered light/dark, feedback, disabled controls, scroll reachability, frameless layout, and contained overlay focus. Fixed Tab escaping the overlay using the existing focus helper. `docs/ios-foundation-qa.md` records evidence, temporary serving details, and native-device limitations. No product screens have been added.

Keyboard follow-up: added an interactive desktop iOS 18 keyboard specimen to the foundation and opened it using `?keyboard=1`. Reused local glyph assets and buttons, inspected Figma keyboard `106:59544`, and verified typing, shift, delete, numbers, emoji, hiding/reopening, and 320px containment. Touch devices retain their real keyboard; dictation is disabled. Refreshed the verified production snapshot.

2026-09-24: Kept the desktop iPhone screen at the requested 402 × 874 with and without the keyboard by removing its viewport-dependent height override. Verified live DOM dimensions and keyboard containment, visually inspected, passed focused build, and refreshed outputs/ios-foundation.

2026-09-24: Separated preview system-chrome geometry from app header/footer, added neutral light/dark system tokens and app overlay isolation, verified browser dimensions/colors and focused build, refreshed output. Installed and validated matching ios-web-foundation skill rules.

2026-09-24: Removed Hide keyboard from the simulated keyboard; preserved and verified Escape dismissal. Updated and validated ios-web-foundation with the same rule. Browser inspected, focused build passed, and output refreshed.

2026-09-24: Corrected earlier incomplete mouse implementation: applied no-hover rules and a native 40px circular cursor to the actual foundation preview. Corrected dimensions to outer frame 402 × 874 inclusive of bezel. Verified DOM geometry, hovered primary/ghost/keyboard styles, cursor scope, keyboard focus, and focused build; corrected saved skill sizing semantics.

2026-09-24: Added workspace drawer outside phone with top Mockup/Landpage/Design system select and bottom Light/Dark/System theme controls. Reused existing views, native dialog/select and Button; extracted shared theme behavior with storage/system sync. Expanded foundation build to bundle existing view entries. Verified view loading, theme persistence/sync, keyboard containment and Escape, 390px responsive layout, and full copied-source build. User's trailing "when it" remains incomplete; used stated workspace-navigation assumption after clarification request.

2026-09-24: Moved all Design system section navigation into the main workspace drawer, sharing existing section metadata. Documentation now renders directly without an embedded sidebar/container. Kept standalone docs navigation intact. Verified section selection/active states/focus, Back navigation, narrow pinned controls and scrolling, and full build.

2026-09-24: Replaced the Foundation demo screen with the existing LiveMap around Grand Central. Removed demo header/content/composer and keyboard preview controls from this view. Kept current phone shell, system chrome, cursor, theme and drawer. Extracted shared map CSS without changing the original map flow; used existing public browser token in temporary preview. Verified live tiles, light/dark, zoom/recenter, point selection and build.
