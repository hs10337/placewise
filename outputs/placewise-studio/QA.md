# Token foundation verification

## Documentation v0.3

Updated the reference to the revised design-system skill: 14 sidebar pages, independent token-layer and theme choices, starter icons and component entries, UI/scenario patterns and a typed Figma mapping. Shared production controls were not added during this documentation pass. Native specimens identify their implementation limits.

`npm run design-system:docs` and `npm run design-system:check` pass. TypeScript and the studio production bundle pass. The checker validates 192 typed token records, aliases, units, complete theme modes, mapped-name uniqueness, CSS/export freshness and hashed documentation/source assets. All 28 declared contrast pairs pass per theme. Additional adapter checks exercised invalid input, type/unit mismatch, missing aliases, cycles, duplicate names and deterministic regeneration.

Browser review used the final port 5177 build in light and dark at desktop and mobile widths. Every sidebar route was exercised at 320px with no horizontal page overflow; wide token tables remain in their own scroll regions. The sidebar theme switch preserved the selected page and its 61px menu scroll position. Saved appearance survived reload. Filtering, layer selection and token copying worked independently from appearance.

Verified Button activation and visible keyboard focus, native radio arrow-key selection, select changes, associated form error/invalid state, preserved drafts, suggested-answer recovery and Accordion keyboard expansion. Native dialog testing found a backward-tab escape to the browser focus boundary; explicit wrapping now keeps Shift+Tab on System and Tab on Close. Escape returns focus to Menu. Skip to content bypasses the sidebar and reaches the first content control. Final warning/error logs were empty.

The Figma page shows `color/primary` with the actual light/dark alias targets and an honest not-connected state. Local files are generated and current; no Figma variables, bindings or schedules were applied. This is not a full screen-reader audit or legacy landing-page migration.

## Foundation v0.2

September 14, 2026 · foundation v0.2.

`npm run build:studio`, `npm run build` and `npm run design-system:check` pass. The final studio build contains the responsive shadow fix and updated mockup labels. Both standalone outputs inline their JavaScript and CSS; the documentation output defaults to the design-system section.

The token checker validates aliases, missing references, cycles, mode parity, metadata and generated CSS freshness. All 28 declared contrast pairs pass in each mode. The lowest checked text ratio is 5.23:1 in light and 5.58:1 in dark. Focus rings and input boundaries are checked separately against a 3:1 minimum. This validates the declared pairs, not every possible composition.

Browser review used the rebuilt page at http://127.0.0.1:5177/#design-system. Confirmed pure white light reading surfaces, dark surface and primary mappings, the chosen font families, Light/Dark/System selection and saved Dark preference in a fresh tab. Checked copy feedback, editable typography, interest selection, preference feedback, whitespace-only input disabling and accordion expansion.

Reviewed desktop at 1440px and mobile at 390px and 320px. The 320px check caught an overflowing shadow specimen; after correction, document scroll width equals client width with primitive scales, typography references and foundation aliases expanded. Final browser warning/error logs were empty. The shared iPhone mockup was visually checked in dark mode, including readable selected map pins.

Reduced-motion behavior and storage-denied initialization were checked in source and initializer scenarios. This pass was not a full screen-reader audit or a complete legacy-component migration. Some older landing-page controls still have smaller targets; the new foundation defines a 44px minimum for future component work. External fonts and the mockup photo require network access. Component tokens remain deferred.


## White canvas refinement, 2026-09-14

Light --background now resolves to #FFFFFF; --secondary and --accent resolve to #F4FAFB. Stronger Glacier remains available for compact interactions. Browser text selection uses --secondary-active with --secondary-foreground to remain distinguishable from white. Dark canvas remains #101C22.

Both production builds pass. The generator verifies all 28 contrast pairs in each mode, and the 192-record token export plus HTML/source snapshots pass freshness checks. Browser review covered desktop light/dark Colors, white surfaces in the app mockup, the Colors page at 390px with no page overflow, and the faint mobile menu surface with Escape returning focus to Menu. Final warning/error logs were empty.


## Complete primitive palette, 2026-09-14

Audited dark semantic alias chains: 43 color records resolve to 23 primitive colors, with zero missing targets and no raw semantic color values. The overview now renders all 41 primitive colors, including Slate and the dark-theme Oxblood/Peach/feedback shades. Actual usage labels distinguish Light, Dark, both, and the three unused primitive colors.

Studio build and token/export/artifact checks pass. Browser verification covered All (41), Light (21), Dark (23), the default Primitive table, correct slate-950 and oxblood-300 values, keyboard operation of the usage filter, appearance changes preserving that filter, 1440px and 320px layouts, and mobile menu Escape/focus return. Fixed excess mobile spacing in the palette introduction. No page overflow or browser warning/error logs remain. Token values and the existing palette are unchanged.
# 2026-09-14: iPhone wireframe iteration workspace

Replaced the earlier phone study with the current map-first iPhone wireframe. The Studio keeps direct Mockup and Design system links and a shared appearance control. Screen shortcuts live outside the phone; the app itself has one map workspace, a bottom sheet and full-height place conversations.

Verification: `npm run build:studio` passed TypeScript and production bundling. The token checker passed 192 exported records and 28 contrast pairs per theme. `node scripts/design-system-artifacts.mjs --check` verified both packaged HTML entries, source snapshots and the token download.

Browser review used the actual packaged page at port 5177. Checked the desktop dark appearance, light appearance, area discovery, selecting a place, sending a custom question and opening it through Recent. A draft remained intact across Mockup → Design system → Mockup; a submitted question remained in Recent after reload. At a 320px viewport, document scroll width matched its 305px content width. The mobile Studio navigation and existing design-system menu were also checked.

The phone uses illustrative map/place/answer content. Search filters only the example places; Refine explains the proposed action. It does not call maps, location or AI services. Research uses a separate v2 mockup storage key. The editable sources are `landing-page/src/studio/Mockup.tsx` and `ios-wireframe.css`.


## Ask with a map or photo, and plan a walk, 2026-09-15

Revised the iPhone wireframe around the three user scenarios. Map selection attaches the exact subject to the question. Sample camera capture leads to a photo review with an editable nearby location and subject choice. Prepared answers reference official sources; unsupported questions remain explicit wireframe responses. Walk setup covers total outing time, interests and an optional coffee pause, followed by a route preview and a persistent active walk.

`npm run build:studio` and `npm run design-system:check` pass. The build includes TypeScript, production bundling, 192 typed tokens, 28 declared contrast pairs per theme, and packaged artifact/source freshness. Browser warning/error logs were empty during review.

Browser verification on port 5177 covered the Graybar building question, sample statue photo capture and question, per-subject draft retention, source links in the answers, and switching to the design system and back. Walk checks covered time/interests/coffee setup, stop reordering/removal, preference changes preserving those edits, starting, skipping, asking at a stop, returning, pausing, ending, resuming and finishing. Recent retains the latest walk and a separate planned route. Reload restored conversations, a draft, route edits and a paused walk.

Visual review covered light and dark appearances, the full phone composition and a 320px viewport. Fixed negative header-button margins that caused internal horizontal scrolling. Final page width and scroll width both measured 305px; home/photo content widths matched their 243px scroll widths, and route editing widths matched at 232px. The primary route-start control stays within the phone while the stop list scrolls. Cleared only this pass's v3 test state and restored the user's Light appearance and normal viewport.

This remains a wireframe: no real camera access, map matching, routing, AI or account sync. Map and photo artwork are schematic. Route duration/distance figures are illustrative. The older v2 browser storage is preserved; the PRD still describes the earlier discovery-group scope.


## Basic-box revision, 2026-09-15

Removed the Studio top navigation, page introduction/footer, external screen picker/reset, device chrome, icons, map/photo artwork, captions, helper prose, and factual sample answers. The wireframe now uses plain grayscale rectangles and essential labels; answer content is a placeholder box. Existing v3 drafts, subjects, routes and walks remain intact.

`npm run build:studio` and `npm run design-system:check` pass. Browser review confirmed the removed chrome and basic-box composition. Camera/photo and planner paths remain usable. At 320px, page and scroll widths both measured 320px; planner content and scroll widths both measured 268px. No warning/error logs. Restored the normal viewport and map home without clearing user state.


## Map focus and compact chat, 2026-09-15

The map now takes the remaining screen height above a single-row chat composer. Removed Ask, Plan a walk and Return to walk from the home chat area. A small Plan control on the map opens the active walk, saved route or initial planner. Chat responses retain the map above them. Existing state remains unchanged.

Studio build and design-system/artifact checks pass. Browser review confirmed the compact home layout and Plan opening the existing active walk, then returning to the map. At 320px, page and scroll widths both measured 320px; the map measured 643px within the 738px phone. Restored the normal viewport.


## Left menu and attachment control, 2026-09-15

Moved Plan and Recent off the map into a left drawer. Recent uses secondary visual emphasis. Replaced the chat Photo label with + and the accessible name Add photo. The drawer has inert background sections, dialog semantics, focus containment, Escape/backdrop dismissal and destination-aware focus restoration.

Final Studio build and design-system checks pass. Browser review verified the map composition, Plan/Recent navigation, + opening the camera, Shift+Tab/Tab wrapping, Escape restoring the menu trigger, and no warning/error logs. Returned to map home without changing saved user state.

## Live map, 2026-09-15

Replaced the map placeholder with Leaflet 1.9.4 and live OpenStreetMap raster tiles centered on Grand Central. Three fixed building markers render shared Button primitives through divIcon portals and attach the existing subject context. Added zoom controls, visible attribution and a tile-error retry state. The map has isolated stacking, keyboard panning, container resize handling and a parent-held viewport that survives full-height screens. Camera, answers and walking routes remain simulated.

Studio build, TypeScript, token checks and packaged artifact freshness pass. Vite reports the combined standalone JavaScript exceeds its 500 kB advisory threshold (547 kB minified, 164 kB gzip); the Studio intentionally bundles into one HTML file. No browser warning/error logs occurred in the working preview.

Browser checks confirmed loaded OSM tiles, mouse and Space activation of building markers, chat attachment, zoom from 17 to 18, keyboard panning, and camera return preserving marker positions within 1px rounding. Existing active-walk and chat views resized the map to 200px and 324px without missing tiles. At a 320px viewport, all three home markers and attribution fit, all tiles loaded, and page width matched scroll width at 320px. Cleared only temporary unsent QA input, removed the temporary subject selection, and returned to map home with the viewport override reset. Existing conversations and walk progress were retained.

The old local server had stopped; restarted it on port 5177. Its browser error tab could not be navigated by the browser tool, so opened the working preview in a fresh deliverable tab. No real geolocation, geocoding, directions or AI service was added.

## Apple Maps and reference page structure, 2026-09-15

Matched the composition of the user-provided `http://127.0.0.1:3000/app` reference: centered title, Reset mockup and Design system actions, System/Light/Dark controls, and an iPhone frame below. Omitted the reference's explanatory paragraphs. App controls remain basic boxes; the page, phone and configured map follow the selected theme. The design-system sidebar now links back to the mockup.

Replaced Leaflet/OSM with Apple's official `@apple/mapkit-loader`, MapKit JS 6, and a typed browser-token loader. Added `landing-page/.env.example` and ignored local environment files. No Apple Maps token was available. The phone therefore shows a plain Apple Maps placeholder and the setup link stays outside the phone; no substitute map or borrowed token is used. Live Apple map loading, marker behavior and provider authorization remain unverified until `VITE_APPLE_MAPS_TOKEN` is supplied and the page is rebuilt.

Studio build, TypeScript, 192-token export, 28 contrast pairs per theme and artifact freshness pass. The standalone JavaScript is now 402 kB minified (122 kB gzip), without the previous size advisory. Browser checks covered the reference composition, Light/Dark changes, design-system round trip, menu Escape/focus restoration, and the photo/cancel path. At a 320px viewport, content and scroll widths both measured 305px (15px reserved for the scrollbar), with a 257px phone content width. Returned to map home, Light appearance and default viewport. Browser warning/error logs were empty. Reset was not activated against the user's saved study, and conversation/walk data was retained.


## Mapbox and visual refinement, 2026-09-15

Replaced Apple MapKit with Mapbox GL JS 3.30.0, using Light v11 and Dark v11. The user supplied the public browser token, saved only in ignored landing-page/.env.local and embedded as expected in the compiled public preview. Removed the Apple dependency, loader and obsolete packaged helper copies. Marker buttons expose group labels and native button semantics; camera position survives full-height detours and theme changes. Recoverable tile errors retain interaction, while initialization, authorization and style failures offer Retry. Initial zoom 15.5 keeps the three example markers visible on narrow phones.

Refined the existing page and phone with warm neutral surfaces, a burgundy accent, full-bleed map, floating menu and zoom controls, compact rounded composer, icon buttons, clearer selected context and a restrained drawer. Preserved the page structure, Plan/Recent menu hierarchy and v3 study data. Motion respects reduced-motion preferences. No new product sections or explanatory paragraphs were added. Photo capture, answers and walking routes remain simulated.

The final Studio build and TypeScript pass. Token references, 192-token export, 28 shared contrast pairs per theme, generated source snapshots and artifact freshness pass. Scoped mockup checks measured text contrast at 14.94:1 light and 14.03:1 dark, muted text at 5.27:1 and 7.15:1, input boundaries at 3.98:1 and 5.50:1, and primary button text at 11.31:1 and 8.12:1. The combined standalone JS is 2,276 kB minified / 646 kB gzip; Vite reports its size advisory. The prototype intentionally keeps one bundled HTML entry.

Browser verification confirmed real Mapbox tiles in both themes, three selectable building markers, keyboard Space selection, visible attachment context, zoom doubling marker spacing, photo entry/cancel, Plan returning to the existing 1/3 active walk, the map/chat split, Send becoming enabled with context and text, design-system round trip, and Escape restoring focus to the menu trigger. At a 320px viewport, page and scroll widths both measured 305px with a 263px map; all three 44px-high marker buttons fit inside it, and the composer remained 54px high. Mapbox logo and attribution controls are visible. Resolved the provider's style-diff warning by explicitly replacing styles on the same map instance; the final load and light/dark round trip produced no new browser warnings or errors.

Cleared only the temporary unsent QA draft and selection. Did not reset the study, submit a new chat turn, change walking progress, or publish externally. Finished at #mockup, map home, Light theme, default browser viewport, no selected marker and an empty composer.


## Typed conversation history and independent walks, 2026-09-15

Implemented the approved flat menu: conditional Resume walk, fresh Plan a walk, three recent entries with Chat/Walk plus duration, and View all. Chat entries restore chat context; Walk entries restore their route and link back to the associated planning conversation. Contextual planning can add a route to a Chat without dropping earlier questions. Map-home selection starts/reopens a standalone place conversation; questions entered within a walk stay attached to it. Resume restores saved progress with one tap, prefers an active walk over paused work, and starting another walk pauses rather than overwrites the old one.

Added lib/mockup-state.ts with validation, deep-copy factories and migration to placewise-ios-wireframe-v4. The v3 record is retained. Legacy chats, photo/map attachments, drafts and walks are imported; unmatched legacy global route/walk records stay separate because v3 had no reliable conversation association. Each new conversation stores its own questions, attachments, draft, preferences, route and walking progress. Routes and answers remain simulated.

Ran node --test scripts/test-mockup-state.mjs: 11 tests pass. TypeScript and npm run build:studio pass. npm run design-system:check verifies 192 tokens, 28 contrast pairs per theme and artifact/source freshness. The known standalone bundle size advisory remains at roughly 2.3 MB minified / 648 kB gzip.

Browser QA used localhost:5177 as a separate storage origin from the user's 127.0.0.1:5177 study. Verified the empty menu, real map selection and question submission, Chat labeling/reopening, generation changing the same item to Walk, original question retained under Earlier, route Conversation/View walk round trip, planning cancel preserving progress, separate 45-minute architecture and 60-minute art routes, pause/resume at 2/3, starting one walk preserving the other's progress, and persistence across reload. Verified three recent rows with four total in View all, keyboard Tab wrap to Close menu, light/dark display, and 320px reflow with 305px page/scroll widths. History row heights were 68–83px and all fit horizontally. Browser warning/error logs were empty. No claim of full screen-reader, RTL, or native keyboard testing.

Rebuilt the user's main preview without resetting or adding QA records to it. The new history and any imported active walk are available in the drawer.

## New chat button, 2026-09-15

Added New chat to the bottom-right drawer footer, outside scrolling history. It creates a separate empty conversation, retains the current map viewport, closes the drawer and focuses Message. Existing conversations and walk state are preserved; empty conversations stay out of recents.

Studio build, TypeScript and design-system freshness/contrast checks pass. Browser verification confirmed a blank composer with focus on pi-question, unchanged saved Walk history and Resume walk availability after reopening, and Tab wrapping from New chat to Close menu. The button measures 44px high with 24px bottom spacing, fits inside the drawer at 320px, and the page has no horizontal overflow. Browser warning/error logs were empty. Restored the default viewport and left the user's menu open with the new button visible. No messages were submitted and walking progress was unchanged.


## Place selection, keyboard and chat flow, 2026-09-15

Implemented the agreed iOS interaction: desktop double-click adds a named place or arbitrary coordinate context; a single click does not select. Touch/pen long press is supported with movement/end/multitouch cancellation, plus Enter/Space alternatives. Tapping Message expands the composer and working keyboard simulation on desktop. Sending closes the keyboard and expands a scrollable conversation with clearly labeled, sourced sample replies. Follow-ups remain in that conversation. Reload opens the compact map state while preserving chats and walking progress. Unknown coordinates request identification rather than inventing a building.

Browser QA on separate port 5187 verified single-click versus double-click, no keyboard on selection, keyboard letters/number/delete controls, Send and Enter submission, two retained turns, reload returning to a blank map, history restoration of both turns, arbitrary-coordinate selection by double-click and keyboard, context/pin removal, and dark mode. At 320px, the composer and keyboard fit without horizontal overflow and the map remains 320px high while typing. Composer type is 16px to avoid iOS input auto-zoom. Warning/error logs were empty. Native-device long press and OS keyboard dismissal are not verified.

All 17 state tests pass. TypeScript, the Studio production build, 192-token validation and 28 contrast pairs per theme pass. Existing local dependency reads stalled; the successful build used an isolated temporary source copy and an exact npm-ci install from the unchanged lockfile. Generated outputs were copied back atomically. The known Mapbox bundle size advisory remains (about 2.3 MB minified, 651 kB gzip). The main 5177 preview was refreshed at map home; its saved Walk history and Resume walk entry remain intact. No QA questions were submitted to the user's main study.


## Named Mapbox place context, 2026-09-16

Removed the fixed place bubbles. Double-click, touch/pen long-press, and keyboard map selection now query rendered Mapbox place labels and retain the name, coordinates and available category/feature identity. Road labels and unnamed map features use coordinate-only fallback. The selected place has one small pin; its name appears in the composer and saved conversation. Known sample answers require a matching landmark name and nearby coordinates; other named places do not claim researched facts. No additional search API is used.

TypeScript, production Studio build, 29 state/feature tests, token and contrast checks pass. Browser QA on isolated port 5187 verified a single click does not select; double-clicking the live Grand Central label attaches its name; sending gives the existing station sample; reload returns to map home; reopening history restores its name, question and answer; unlabeled points fall back to coordinates; context removal clears the pin. Browser warning/error logs were empty. Native-device long press remains untested.
# September 16: Resizable chat sheet, subsequently withdrawn

The withdrawn chat implementation had compact, half-height and expanded snap positions. Browser verification used an isolated preview on port 5180, preserving the user's 5177 conversations and appearance. The checks in this section are historical and do not validate the requested revert.

Concurrent map work added compass, recenter and simulated-location controls. Preserved those edits and rebuilt the combined source. A further 320px check confirmed the menu, compass and recenter controls fit in the expanded sheet's remaining map area; the map's compact layout hides its separate zoom buttons. This task did not author those map changes.

Verified actual pointer dragging from expanded to half-height and from an open keyboard down to compact; click cycling; ArrowUp, Home, End and Enter; explicit expansion/collapse; automatic half-height on composer focus; sending and four follow-ups; desktop keyboard dismissal; and draft retention. A five-turn conversation preserved a 144px reading offset across collapse/reopen. Reload returned compact and Recent recovered both the saved conversation and unsent draft. Camera cancellation returned keyboard focus to the sheet handle.

Desktop measurements were 425px half-height and 670px expanded within an 874px phone. Expanded retained 180px of map. At 320px viewport width, the 800px phone had no horizontal page overflow; long photo context plus a 120px typing area still fit above the desktop keyboard. Both light and dark layouts were visually inspected. Final isolated-preview console warning/error logs were empty. A final refresh verified the new handle in the main 5177 app, which is left at half-height with the user's Light appearance.

TypeScript and the Studio production build passed using an isolated temporary copy and the existing dependency installation whose lockfile matches this workspace. The original dependency read stalled and was stopped. All 22 existing conversation, migration, map-place and reopening tests passed. Independent review caught and resolved compact-drag overflow, stale click suppression after cancellation, Escape during dragging, hidden-heading focus, and long-context overflow. Pointer cancellation was reviewed in code, not synthesized in the browser. Reduced-motion CSS removes the sheet transition. Native iOS touch and OS keyboard behavior remain unverified. The existing Mapbox bundle-size advisory remains.


## Location dot, heading, compass and recenter, 2026-09-16

Added a clearly identified simulated walking location near Grand Central, with a blue dot and northeast heading cone. Rotation is enabled and tracked in the per-conversation viewport. Compass returns the map to north; recenter moves to the demo dot at a useful street zoom while preserving bearing. No browser geolocation or orientation permissions are used.

Browser checks on separate port5187 verified the dot remains anchored when panning, recenter brings it within1px of map center, Shift+Right rotates15degrees with compass at-15degrees and cone at14degrees, and compass reset restores0degrees/29degrees. Expanded chat leaves a180px map with three distinct48px menu/compass/recenter targets and no overlap; redundant zoom buttons hide in that compact state. Light/dark visuals checked. TypeScript, Studio build,192-token export and28 contrast pairs/theme pass. Native GPS/orientation remain outside this mockup.

## Restore previous chat interaction, 2026-09-16

The user rejected the draggable sheet and requested the previous automatic opening and sizing behavior. Current documentation again describes compact map, composer focus with keyboard, and expanded conversation after sending. The separate map location, compass and recenter changes must be preserved. Revert complete. TypeScript and Studio build passed, and the source-snapshot/artifact freshness check passed. Isolated browser checks confirmed the handle is absent, typing shows the original 88px composer and keyboard, Send dismisses the keyboard and opens the 66% conversation, and Back to map restores compact. The main 5177 preview was refreshed and verified without the handle. Existing user state and separate map controls were preserved.


## 2026-09-16: Keep the composer compact on focus

Applied the user’s precise correction: Message focus opens the keyboard without expanding the home sheet, changing its shape or adding a collapse toolbar. One and two displayed lines fit the existing 54px composer row. The third line grows the row; the textarea caps at 120px and then scrolls. Actual wrapping is measured on draft and width changes. Sent-conversation behavior and the separate map work are preserved.

TypeScript/Studio build and artifact freshness passed. Isolated browser checks measured the sheet at 79px before focus, after focus and through two lines; three lines produced 101px, returning to two restored 79px. Checked soft wrapping, manual line breaks, deletion, width reflow at 320px, long-text scrolling at 120px, and sending into the existing 66% conversation. No page overflow or browser warnings/errors. Main preview refreshed; user history and drafts were not used for testing. Native OS keyboard behavior remains unverified.

## September 16: Neighborhood chat fallback

PASS: Send and Enter submit without a place, photo or route. Whitespace remains disabled and Enter does not send. The reply uses Around Grand Central and the conversation gets that title. Neighborhood labels and both turns survive reload and reopening from history. Explicit sample-photo questions retain their subject response; after removing the photo, new messages use neighborhood context while earlier subject turns retain their labels. All 25 state tests pass, including optional-field backward compatibility and bounded neighborhood validation. TypeScript/Studio build and contrast checks pass. Browser testing used an isolated origin, preserving the main preview’s draft and conversations.

## September 16: Voice transcription control

PASS with injected speech events: empty/whitespace mic, typed Send, clearing restores mic; starting/listening retains compact54px row and keeps keyboard closed; corrected interim results replace earlier words and multiple segments combine; Stop accepts trailing final without sending; editing and new chat ignore stale callbacks; early Stop stays finishing despite delayed start; permission denial, no speech, unsupported API and synchronous start failure recover; long speech caps at500 characters and120px input height. Explicit Send uses neighborhood context and returns empty composer to Mic. TypeScript/Studio build and contrast checks pass. Native recognition API is exposed in the in-app browser, but real audio and its recognition service were not exercised. The fake fixture exists only in the temporary build directory and is not published.

## September 16: Attachment options

PASS: + opens Camera/Photo/File modal; Camera opens existing camera study and Cancel preserves the draft. Initial focus is Camera; Tab/Shift-Tab wrap inside the dialog, Escape returns focus to + with keyboard closed. Native photo picker selected a test SVG and file picker selected a test text document; both displayed correct filename/type and preserved the message draft. Sending snapshots metadata, removal does not erase the sent attachment, and history survives reload. Light/dark screenshots reviewed. At 320px, each option was 55px wide and 88.8px tall with no horizontal overflow. 29 state tests, TypeScript/Studio build and contrast checks pass. Picker cancellation is a no-change path; the automation chooser cannot simulate Cancel with an empty selection. Uploaded contents are not read, uploaded or persisted in this prototype.


## September 16: Mobile attachment list

PASS: Camera, Photo and File now stack as three 56px rows in a compact modal aligned with +, 8px above the composer row. Browser checks on the isolated localhost origin confirmed the 8px gap for empty and four-line drafts and expanded chat. Resizing while open to 320px kept the menu within the phone with no horizontal overflow. Light and dark screenshots reviewed. Camera still opens and Cancel preserves the draft; Shift-Tab/Tab wrap Camera and File; Escape and outside tap restore focus to + with keyboard closed. Browser warning/error logs were empty. Temporary viewport reset. TypeScript, Studio build, token/contrast checks and source/artifact freshness passed. Native iOS keyboard behavior remains unverified.


## September 16: Apple component patterns only

PASS: Applied capsule standalone actions, circular icon buttons, native duration radios and interest checkboxes styled as grouped checkmarked rows, a Coffee switch, and attachment-menu arrow/Home/End navigation with reduced-motion-aware appearance. Existing CSS typography, color, background, border-color and shadow declarations and token files matched the previous published source. Browser computed font/color values for the phone, composer, add button and sheet were identical before/after on the main preview. Isolated browser checks verified radio ArrowDown selection, checkbox and switch Space activation, settled switch thumb position, menu wrap and Escape, and selected60min/Art/Coffee preferences reaching route preview. Light/dark inspected; grouped rows measured56px;320px viewport had no horizontal overflow. Viewport reset and QA tab closed. TypeScript/Studio build,192-token validation,28 contrast pairs per theme and isolated documentation freshness passed; source hashes matched before publication. Browser warning/error logs were empty. Native UIKit/SwiftUI controls were not imported; these are web adaptations of Apple component patterns.
