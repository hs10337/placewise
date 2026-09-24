# iOS foundation verification

September 24, 2026. Source entry: `landing-page/src/prototype/main.tsx`. This is a foundation preview, not a product journey.

## Build environment

The repository's existing `node_modules` contains macOS `dataless` cloud-offloaded files. TypeScript stalled reading an Ionic declaration and Vite stalled reading a Babel module. The stalled processes from this run were stopped. The existing dependencies were not replaced.

A temporary copy at `/private/tmp/placewise-ios-check.R52WAN` contains the foundation source and its imported local dependencies, with packages installed from the existing unchanged `package-lock.json` using `npm ci`. The foundation's TypeScript check and Vite production build passed there. This is a focused check of the new entry and its imports; a full legacy-app typecheck could not complete against the cloud-offloaded dependencies. Vite reports a large Ionic-containing JavaScript chunk, acceptable for this local component study but a later loading-performance concern.

The live preview on port 5178 currently serves that temporary copy. Source edits belong in the repository; sync them into the temporary copy and rebuild if the original dependencies remain unavailable. The production snapshot is copied to `outputs/ios-foundation`. Once dependencies are local again, `npm run dev:foundation` and `npm run build:foundation` run directly from `landing-page`.

## Browser observations

Inspected desktop light and dark appearances and phone layouts at 320, 390, and 430 CSS pixels. The 320, 390, and 430 layouts have no document horizontal overflow. Mobile rendering fills the viewport and hides the simulated system chrome. The frameless desktop toggle removes the bezel, status bar, and simulated top inset.

Primary and secondary actions produce visible status feedback. The disabled action is exposed as disabled. Navigation action height is 44px; the three large action specimens measure 50px. The appearance switch updates both the component surfaces and outer preview. Scrolling at 320px reaches the final caption specimen and the end-of-preview message.

The About overlay bounds match its phone owner. Opening makes the background inert and focuses Done. Testing identified a Tab escape in the reused popover behavior; the preview now uses the existing focus helper for both Tab directions. After the fix, Tab and Shift+Tab retain Done focus. Escape dismisses and restores About focus; Done also dismisses. The dialog has an accessible name. The browser log inspection returned no warnings or errors.

## Reference evidence and limits

Figma contexts and screenshots were inspected for navigation `1:54520`, button `5:108579`, and row `550:50627` in file `NIrQjae7K6P1bWltTznAaN`. The provided `507:24670` starting point resolves to Activity views. The preview uses the confirmed core geometry with existing Placewise semantic colors. Other type-role sizes remain documented approximations.

Desktop browser emulation is not an on-device Safari test. Real safe-area values, software keyboards, VoiceOver, OS text sizing, and OS reduced-motion/transparency settings were not exercised. CSS accommodates zoom, reduced motion, and opaque material fallbacks; real software-keyboard behavior and sheets remain unverified.

## Keyboard follow-up

Added and inspected the desktop keyboard specimen. Verified character insertion, deletion, shift, number and emoji layouts, emoji deletion, hiding/reopening, and physical textarea entry. At 320px, the keyboard ends at the viewport bottom with no horizontal overflow. The focused foundation TypeScript and production build passed again using the same local temporary dependencies. Figma context and screenshot for `106:59544` were inspected. Dictation is disabled; no microphone permission is requested.

## Fixed preview dimensions

Removed the keyboard-open desktop height reduction. Browser measurements confirm the screen is 402 × 874 CSS pixels with the keyboard both open and closed; the keyboard remains within the screen. The 10px decorative bezel adds to those dimensions. Visually inspected the open keyboard. The focused TypeScript check and production build passed using the existing temporary dependency copy.

## Separate system chrome

Verified status bar 54px and home region 26px occupy distinct boxes outside the app header/footer. Screen remains 402 × 874. Inspected light and dark views; status glyphs and home indicator resolve to black and white respectively, independent of brand colors. Verified neutral home surface with keyboard open and closed, and opened/dismissed About within the isolated app layer. Focused TypeScript and production build passed. Updated and validated the installed ios-web-foundation skill with the same rule.

## Keyboard accessory cleanup

Removed the custom Hide keyboard button and unused dismissal prop. Live DOM and screenshot confirm only emoji and disabled dictation remain in the accessory row. Escape dismisses the keyboard; Show keyboard reopens it. Focused TypeScript/build and skill validation passed.

## Frame and mouse correction

This supersedes earlier 402 × 874 screen measurements: that size now applies to the outer frame including bezel; the inner screen is 382 × 854. Browser measurements confirm outer dimensions with keyboard open and closed. Compared the q key before/after mouse hover: background and text unchanged, opacity 1, hover overlay opacity 0. Verified ghost and primary button hover overlays remain 0, custom cursor computed on native keyboard/button/overlay controls, normal pointer outside the phone, and visible keyboard focus outline. Native cursor SVG is 40 × 40 with a 20/20 hotspot; browser screenshots omit the OS cursor. Focused build and corrected skill validation passed.

## Workspace drawer

Verified Mockup, Landpage, and Design system selections load their existing views. Confirmed Light/Dark sync into the documentation view, System selection persists through reload, and the phone frame remains 402 × 874. Tab from the final theme button wraps to Close; Escape dismisses and restores the menu trigger. At 390 × 844, the drawer is 296px wide, theme controls end at 820px, and the page has no horizontal overflow. Inspected desktop light/dark and narrow light screenshots. Real OS color-scheme switching was not toggled during testing; the media-query listener is implemented. Full copied-source TypeScript and all three production entries pass in the temporary dependency environment; existing large-bundle warning remains.

## Unified Design system navigation

Verified all 14 grouped section links appear in the workspace drawer. Colors and Accordion load directly in the parent page; no iframe, separate ds-sidebar, or ds-mobile-bar is rendered. Accordion receives aria-current and section heading focus on selection. Browser Back returns to Colors. At 390 × 844, the section list scrolls to its final entry while selector top stays 104px and theme bottom 820px, with no horizontal overflow. Full TypeScript and production build passed in the temporary dependency environment.

## Live map replacement

Confirmed real Mapbox tiles load around Grand Central in light and dark. Exercised Zoom in, Recenter and Enter-to-select at the map center, confirming a selected-location pin appears. Verified 402 × 874 outer dimensions, the circular cursor on the canvas, and absence of Foundation demo content and keyboard. Inspected both map appearances; reset test selection/camera and returned to System appearance. TypeScript and the three-entry production build passed with existing large-bundle warnings.

## Edge-to-edge map system layers

The live map now extends behind transparent status-bar and home-indicator layers. Desktop browser measurements confirm the canvas matches the full 382 × 854 inner display and the outer frame remains 402 × 874. Both chrome backgrounds resolve to transparent, with black glyphs in light appearance and white in dark; both appearances were visually inspected. Controls and attribution retain safe-area clearance. System theme was restored after checking. TypeScript and the foundation production build passed in the temporary dependency environment; the existing large-bundle warning remains. Real-device Safari was not tested.

## Map toolbar and chat composer

Verified top-left menu and top-right search controls, the bottom attachment/message/microphone row, 44px targets, and unchanged 402 × 874 outer frame. Inspected light and dark appearances and a 390px browser viewport with no horizontal overflow. Search filtering finds Chrysler Building, reports an empty result, and selecting a result adds its map marker and message context. Submitting a message opens the in-memory conversation with its selected-place context. Menu New chat clears the conversation and context. Verified Shift+Tab wraps from Close to the last panel action and Escape returns focus to the original menu trigger. TypeScript, production build and diff whitespace checks pass; the existing bundle-size warning remains. Native file-picker selection and real microphone transcription/permissions were not exercised, and real-device Safari remains untested.

## Phone focus appearance and transparent chrome default

Removed visual focus styling inside the phone. Browser inspection confirms the message input remains focused while its outline and shadow are none; Tab reaches the microphone native button with outline none and Ionic focus-overlay opacity zero. Status and home layers both resolve to transparent. The desktop workspace focus rules remain scoped separately. Installed skill and runtime reference were updated and skill validation passed. This supersedes earlier requirements for visible phone focus rings and opaque system surfaces.

## Map message keyboard

Verified clicking Message opens the simulated keyboard, virtual h/i keys insert text, emoji deletion removes the full character, and a key inserts at the moved caret. Keyboard Send submits to the conversation. Escape removes the keyboard; the frame remains 402 × 874 open and closed. Composer bottom sits 12px above the measured keyboard top; the keyboard extends to the screen bottom under the transparent home indicator. Native coarse-pointer keyboard behavior requires real-device testing.

## Left-side app menu

Measured the drawer at 304 × 854, aligned exactly to the inner phone left/top with zero corner radius. Verified inert map content, left-aligned actions, keyboard focus wrapping, Escape dismissal and return to the menu trigger. New chat closes the drawer before focusing Message and opening the keyboard. Inspected light and dark appearances and confirmed transparent status/home layers. Foundation build, diff whitespace check and installed skill validation passed.

## Full-screen conversation and replies

Verified Send immediately opens a page (no dialog) with a pending reply, followed by a sourced Chrysler sample answer. A follow-up retained place context and received the existing detail response. The page measures 382 × 854, matching the entire inner display. Back to map and menu Conversation reopen the same two-message history. The shared keyboard opens in chat, reduces the scrollable transcript height, and preserves the 402 × 874 frame. Send and microphone use separate keyed controls to prevent a submit click from triggering the replacement microphone action.

## Sent message attachments

Selected Chrysler Building through search and sent a question. Its attachment card appears inside that message and the composer context clears. A follow-up receives the Chrysler detail answer without duplicating the attachment. Selecting Grand Central for a later message preserves the first message's Chrysler attachment. TypeScript and the foundation production build passed with the existing bundle-size warning. Uploaded file metadata rendering is implemented; native file-picker interaction was not exercised.

## Persistent chat actions

Replaced the title/back header with the shared app-menu control and right-aligned New chat and three-dot controls. Verified the left drawer, Escape dismissal, options-sheet View map, conversation reopening, sending, and clearing a populated conversation with New chat. All three buttons measure 44 × 44; the frame remains 402 × 874 and navigation stays visible with the keyboard. Inspected the toolbar in light and dark and the bottom sheet in light. Added a neutral raised dark surface for the sheet. TypeScript and production build pass; real-device behavior remains untested.

## Library navigation and recent conversations

The app drawer now contains Places, Routes, and Recent. Created two separate chats, verified most-recent-first ordering, reopened the older chat with its original message and attachment, and sent a follow-up that moved it to the top. Places returns to the map. Routes shows an empty page with the composer hidden. Empty new chats are excluded from Recent; history currently lasts for the open preview session. TypeScript and the foundation production build passed.
