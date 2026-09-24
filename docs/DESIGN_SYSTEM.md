# Placewise design system

Documentation v0.3.1 · September 2026. Code is authoritative. [brand_guidelines.md](brand_guidelines.md) records the approved Glacier + Oxblood palette and Bricolage Grotesque / Instrument Sans pairing; [product.md](product.md) governs behavior. This reference documents the implemented primitive and semantic layers. Component tokens remain deferred.

## Authority and generated outputs

| Purpose | Source or output |
| --- | --- |
| Token values, aliases and roles | [tokens.json](../landing-page/src/design-system/tokens.json) |
| Typed CSS resolver | [tokens.ts](../landing-page/src/design-system/tokens.ts) |
| Generated theme | [tokens.css](../landing-page/src/tokens.css), imported through [theme.css](../landing-page/src/theme.css) |
| Typed catalog and Figma mapping | [token-catalog.mjs](../landing-page/src/design-system/token-catalog.mjs) and [TypeScript contract](../landing-page/src/design-system/token-catalog.d.mts) |
| Documentation shell/navigation | [DesignSystem.tsx](../landing-page/src/studio/DesignSystem.tsx), [design-system.css](../landing-page/src/studio/design-system.css) |
| Live specimens/compositions | [DesignSystemExamples.tsx](../landing-page/src/studio/DesignSystemExamples.tsx), [design-system-examples.css](../landing-page/src/studio/design-system-examples.css) |
| Theme preference/Studio shell | [Studio.tsx](../landing-page/src/studio/Studio.tsx), [studio.css](../landing-page/src/studio/studio.css) |
| iPhone iteration mockup | [Mockup.tsx](../landing-page/src/studio/Mockup.tsx), [LiveMap.tsx](../landing-page/src/studio/LiveMap.tsx), [ios-wireframe.css](../landing-page/src/studio/ios-wireframe.css) |
| Generated references | [design-system.html](design-system.html), [Studio index.html](../outputs/placewise-studio/index.html), [design-system.tokens.json](design-system.tokens.json) |
| Generation/freshness | [build-studio.mjs](../landing-page/scripts/build-studio.mjs), [design-system-artifacts.mjs](../landing-page/scripts/design-system-artifacts.mjs) |

Generated HTML includes compiled JavaScript and CSS. Its `source/...` links point to source copies packaged beside each reference; the token download is packaged there too. Regenerate these assets through the build. Do not edit generated HTML, CSS, exports or source copies independently.

## Iteration workspace

The wireframe opens at `#mockup`; the reference remains available directly at `#design-system` and `#ds-*`. The mockup page follows the user-provided reference at `http://127.0.0.1:3000/app`: a centered heading, Reset mockup and Design system actions, a System/Light/Dark control, then an iPhone frame. The app uses a full-bleed map, warm neutral surfaces, a restrained burgundy accent, rounded floating controls and a compact composer. The left menu and existing flows stay in place, without explanatory paragraphs. The design-system reference retains its own appearance controls and links back to the mockup. Reset starts only the current v4 study over; legacy v3 data is retained.

The iPhone study centers on asking about a selected building or photographed object, and planning a neighborhood walk. The map uses Mapbox GL JS with Light v11 and Dark v11 styles. A public browser token in `landing-page/.env.local` (`VITE_MAPBOX_ACCESS_TOKEN`) is required, followed by a rebuild. The user supplied a public token for the local preview. Without a token, the map area remains a labeled placeholder and setup guidance stays outside the phone. The integration supports panning, zooming, theme changes and three fixed building subjects around Grand Central; Mapbox attribution remains visible. Double-clicking the map simulates iOS long-press and attaches a visible location to the question. Single clicks do not select. Named markers and arbitrary coordinates are supported, with Enter/Space alternatives and touch-hold cancellation on movement. Tapping Message keeps the composer compact and shows an interactive iOS-style keyboard on desktop; touch devices use their native keyboard. Tapping outside the keyboard and message field dismisses the keyboard without clearing the draft or consuming the tapped action. Tapping the message field again reopens it; the opening tap remains an input interaction even if the keypad moves the field before release. One or two displayed lines fit the existing row. Only a third line grows the composer, up to the 120px input limit; deletion and width changes recalculate its size. An empty composer shows a microphone instead of a disabled Send button. Speech recognition fills the draft for review; Stop remains available until the final result, then Send appears. Typing, navigation or leaving the page ends microphone use. Browser support and microphone errors are handled inline. Sending requires only a nonempty message. Without a selected place or photo, the message snapshots the current neighborhood (Around Grand Central in this demo), which appears above the sent message and survives reopening. Explicit attachments take priority. Sending dismisses the keyboard and expands a scrollable conversation; follow-ups remain on that page. Reload opens the compact map state with chats and walk progress saved in the menu. Unsent draft context is preserved without opening the keyboard. Sample photo capture can also attach a subject. Walk setup leads to a simulated route preview and an active walk that survives detours into conversation. The drawer separates Resume walk from Plan a walk and previews three recent conversations, with Chat or Walk plus duration labels. View all opens the full mixed history. A New chat button stays at the bottom right of the drawer, opens a blank conversation on the current map viewport and focuses the composer. Existing conversations, drafts and walking progress remain saved; empty new chats stay outside history until used. Chat items restore chat; Walk items open their own route. The route links to its planning conversation, and a chat can generate its first route through its contextual Plan a walk action. The menu action always begins a fresh plan. Selecting a place from map home starts or reopens its standalone Chat; questions entered from the walk or its Conversation stay with that walk. Each conversation owns its selected subject, draft, questions, route and progress; starting another walk pauses the previous one without replacing it. Camera capture remains a placeholder; chat uses clearly labeled, sourced sample replies rather than a live AI service. These September 15 user flows expand the earlier PRD's scope, which still describes the prior discovery-group concept.

Edit the React mockup and its scoped stylesheet to iterate; rebuild with `npm run build:studio` to refresh the standalone Studio and this documentation entry together. The v4 browser storage key imports valid v3 chats, drafts and walks without deleting the legacy record. Questions preserve their own attachment context. Unsubmitted plans stay outside history; an item gains the Walk label only after route generation. No camera permissions, live location, routing or AI services are connected.

## iOS component patterns

For future iOS element work, consult the [user-supplied iOS 18 and iPadOS 18 Figma file](https://www.figma.com/design/NIrQjae7K6P1bWltTznAaN/iOS-18-and-iPadOS-18--Community-?node-id=221-56229) first. Inspect the relevant component, variants and states before choosing or adjusting a web implementation, including status bars and keyboard previews. Match its component geometry, spacing, sizing and layout while retaining Placewise typography, colors and approved interaction behavior. Use Apple’s Human Interface Guidelines for behavior and accessibility. If file access is unavailable, record that limitation rather than claiming the component has been verified against the file.

The iPhone prototype uses `@ionic/react` 9.0.4 in iOS mode for all applicable app controls, preserving Placewise typography, palette and tokens. [Ionic React](https://ionicframework.com/docs/react/add-to-existing) supplies third-party web components; it does not import Apple's UIKit or SwiftUI. Keep Ionic's component structure and pressed states, match geometry to the supplied iOS 18 kit, and apply Placewise's existing type and color roles through its supported styling APIs. Keep 44px minimum touch targets, visible focus and clear selected states. Apple's [buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [menus](https://developer.apple.com/design/human-interface-guidelines/menus) and [toggles](https://developer.apple.com/design/human-interface-guidelines/toggles) remain the interaction references.

`IonHeader`, `IonToolbar`, `IonTitle` and `IonButtons` provide navigation bars; `IonMenu` provides the sidebar. App actions, map controls and the simulated desktop keyboard use `IonButton` through the shared `IosButton` adapter. History and route rows use `IonList`, `IonItem`, `IonLabel`, `IonNote` and `IonBadge`. Attachment choices and route editing use `IonPopover`; keep these overlays inside the phone, with attachments positioned above +. `IonSelect` and `IonSelectOption` provide subject and neighborhood selection. Duration, interests, Coffee, photo location and the composer use `IonRadioGroup` / `IonRadio`, `IonCheckbox`, `IonToggle`, `IonInput` and `IonTextarea`. App icons use `IonIcon` with Ionicons, and loading feedback uses `IonSpinner`. The decorative preview status bar uses original cellular, Wi-Fi and battery SVG exports from the supplied iOS 18 kit. Its side-column layout follows the kit; the approved Placewise time typography remains. Keyboard Shift, Delete, emoji and microphone glyphs are also original exports, stored in `landing-page/src/assets/ios18` and tinted through existing palette roles. These are preview assets, not native operating-system indicators.

The approved composer and conversation sizing remain app-specific: focusing the composer keeps it compact, a third text line grows it, and sending opens the conversation. No draggable detents are introduced. Mapbox remains the map provider. Hidden file inputs still invoke the browser's file/photo pickers, and touch devices use their real OS keyboard; the desktop keyboard is a simulation composed of Ionic buttons with reference-based keycap geometry: 42px visible keys inside 44px desktop targets, 4.6px corners, 54px row pitch, wider space/return keys, and a bottom accessory row. Emoji, dictation and keyboard dismissal controls work; predictive suggestions are omitted because this prototype has no prediction service. The home indicator is 144×5px in a 26px area. Large primary buttons use 50px height and 12px corners; menus use 250px panels, 12px corners and trailing icons; regular list rows use 44px minimum height with 16px insets. See [the component audit](ios-component-audit.md) for measured source nodes and validation. The marketing page and documentation shell retain their existing primitives and Lucide icons. This replacement does not change the token catalog, typography or colors, and does not install Apple fonts or native Apple frameworks. The browser renders exported Figma vector artwork where noted.

## Layers and themes

Primitives use `--primitive-*` and hold invariant raw values. Semantic names express purpose and alias primitives or other semantics. For example, `{--primitive-color-oxblood-800}` compiles to `var(--primitive-color-oxblood-800)`. Every semantic role resolves in both themes. Use `--primary` with `--primary-foreground`, plus its hover/active roles. Add a component token only when a real component needs a reusable decision beyond the semantic layer.

The Colors reference displays all 41 primitive colors as family ramps, including every dark-theme shade. “Palette usage” filters the ramps by actual Light or Dark semantic aliases, independently of the appearance switch. Labels distinguish colors used by one theme, both themes, or neither. The detailed Colors table defaults to Primitive; switch to Semantic for both mode mappings. Primitive values are invariant, but their use can differ by theme.

Light uses pure white for `--background` and `--card`, with faint glacier-50 for `--secondary` and `--accent`. Reserve stronger Glacier for compact interactive emphasis and details. Oxblood text/actions and restrained Peach retain the palette's character. Dark uses slate-950 canvas, slate-900 reading surfaces, light text and oxblood-300 actions with oxblood-900 text. Peach shifts to peach-300. Use matching surface/foreground pairs for popovers, secondary actions, selection and feedback. `--border` separates content; `--input` and `--border-strong` identify controls. Focus uses `--ring`, `--focus-width` and `--focus-offset`.

The sidebar footer has a Light/Dark switch and a separate System control. A valid saved `placewise.studio.theme` choice wins; otherwise System follows the OS, with light as fallback when the media API is unavailable. Storage failure leaves a session-only preference. The entry initializes `html[data-theme]` before React renders. Theme changes preserve the page and sidebar position. The mockup uses warm neutral light and dark surfaces with a burgundy accent, while the page follows shared semantic tokens. Mapbox receives the resolved theme without recreating the map. Drawer and control transitions respect reduced motion.

## Documentation layout and navigation

The Primer-style structure uses Placewise tokens: a 272px desktop sidebar with an independently scrolling menu and persistent theme footer, plus a reading column capped at 1120px. Gutters step from 64px to 32px, 24px and 16px as width decreases. At 850px, the sidebar becomes a native modal menu. The Studio header is 80px on desktop and 64px on mobile. Wide token tables scroll inside labeled regions.

| Group | Pages, in navigation order |
| --- | --- |
| Design system | Figma library, Foundations, Icons |
| Primitives | Colors, Sizes, Typography |
| UI patterns | UI patterns |
| Scenario patterns | Scenario patterns |
| Components | Button, Toggle, Radio, TextInput, Select, Accordion |

These 14 pages use stable `#ds-*` links and `aria-current`. `#design-system` opens Foundations. Legacy `#ds-primitives` and `#ds-semantics` open Colors; `#ds-components` opens Button. Escape, backdrop and Close dismiss the mobile menu and return focus to Menu. Choosing a page closes the menu and focuses its heading. Keep layer selection independent of theme selection.

## Typography and dimensions

| Role | Family | Size / weight / line height |
| --- | --- | --- |
| Display | Bricolage Grotesque | 48px / 600 / 1.1 |
| Title | Bricolage Grotesque | 32px / 600 / 1.2 |
| Heading | Instrument Sans | 24px / 600 / 1.2 |
| Body | Instrument Sans | 16px / 400 / 1.6 |
| Label | Instrument Sans | 14px / 500 / 1.4 |
| Caption | Instrument Sans | 12px / 400 / 1.6 |

Use `--type-{role}-{font,size,weight,leading,tracking}`. Sizes are rem values; pixel equivalents assume a 16px root. Keep Bricolage upright with optical sizing; use Instrument for reading. Fonts load from Google Fonts with sans-serif fallbacks. Local-script coverage needs a future localization decision.

Spacing spans 4–64px, following an 8px rhythm with a 4px compact step. Radius roles are 4, 8, 12px and full; icons are 16, 20 and 24px. New controls use a 44px target floor and 48px default height. Studio small/icon buttons are 44px; legacy landing-page compact controls remain 40px, with some composition targets at 34px. Migrate those as their components are designed.

Use the two shadow roles for elevation. Motion roles are 120, 200 and 320ms with `--ease-standard`; reduced-motion CSS sets them to zero. Reflow content before reducing reading size. Structural grid tracks, breakpoints and viewport mechanics remain local layout choices.

## Atomic registry and compositions

| Entry | Implemented source and contract |
| --- | --- |
| Button | [button.tsx](../landing-page/src/components/ui/button.tsx): variants `default` (primary), `secondary`, `ghost`, `light`; sizes `default`, `sm`, `icon`. Radix Slot supports `asChild`; native props/ref are forwarded. Compose a loading label with disabled state; there is no loading prop. |
| iOS button | [ios-button.tsx](../landing-page/src/components/ui/ios-button.tsx): shared `IonButton` adapter for app actions, map controls and simulated keyboard keys, with explicit iOS mode. Preserve Ionic geometry and pressed states while mapping Placewise type and colors. The live documentation specimens also use IosButton; the landing page and documentation shell retain the base Button. |
| Accordion | [accordion.tsx](../landing-page/src/components/ui/accordion.tsx): Root, Item, Trigger and Content wrappers preserve Radix APIs. FAQ uses `type="single"` and `collapsible`. |
| Toggle | `IonToggle` for the Coffee setting in [Mockup.tsx](../landing-page/src/studio/Mockup.tsx) and its live documentation specimen. No shared Toggle export. |
| TextInput | `IonInput` for photo location and `IonTextarea` for the composer, retaining measured growth only beyond two displayed lines. The live `IonInput` [documentation composition](../landing-page/src/studio/DesignSystemExamples.tsx) shows associated help/error text and recovery. No shared TextInput export. |
| Select | `IonSelect` / `IonSelectOption` for subject and neighborhood in the phone. The live documentation specimen also uses Ionic selection components. No shared Select export. |
| Radio and checkbox | `IonRadioGroup` / `IonRadio` for duration and `IonCheckbox` for interests in [Mockup.tsx](../landing-page/src/studio/Mockup.tsx). The live documentation radio and checkbox specimens use the same Ionic components. No shared Radio or Checkbox export. |
| Navigation | `IonHeader`, `IonToolbar`, `IonTitle` and `IonButtons` for phone navigation; `IonMenu` for the sidebar in [Mockup.tsx](../landing-page/src/studio/Mockup.tsx). |
| Lists and metadata | `IonList`, `IonItem`, `IonLabel`, `IonNote` and `IonBadge` for phone history and route rows; `IonList` / `IonItem` for attachment actions. |
| Popover | [ios-popover.tsx](../landing-page/src/components/ui/ios-popover.tsx): `IonPopover` adapted to the phone frame for attachment choices and route editing. |
| Icons and loading | `IonIcon` with Ionicons in the phone app; `IonSpinner` for loading feedback. Live documentation specimens use the same Ionic components; the documentation shell and marketing retain Lucide. |

Phone icons and live documentation specimens use `IonIcon` with Ionicons. The starter set is `searchOutline`, `addOutline`, `checkmarkOutline`, `closeOutline`, `chevronDownOutline` and `settingsOutline`. Label icon-only controls and hide decorative icons. The marketing page and documentation shell retain Lucide.

UI patterns cover an Ionic prepared-question form, list metadata, empty states, attachment popover and labeled loading/feedback specimens. Scenario patterns cover search, pending interests, explicit updates, saved places and recovery. They reuse prepared data; documentation state stays local to its specimen. Preserve drafts after errors and sources beside answers. A static loading specimen does not represent a running request.

## Guardrails

| Rule | Contract |
| --- | --- |
| Never | Duplicate token values in a separate catalog, fabricate component exports, claim a shared Radio export, or claim a local export is an applied Figma library. |
| Avoid | New wrappers for one-off specimens, primitive colors in product styling, and legacy cleanup unrelated to the current component work. |
| Prefer | Semantic aliases, existing shadcn/ui foundations and the phone's Ionic adapter in `components/ui`, shared helpers in `lib`, visible labels and explicit recovery. |

Geographic illustration colors, physical device frames and photo overlays are content-specific exceptions. Legacy `--font-serif`, `--ink-teal`, `--deep-teal` and `--action-foreground` remain compatibility aliases; new styling uses `--font-display`, `--text-brand`, `--background-inverse` and `--primary-foreground` respectively. Never restore Teal Mist through those aliases.

## Export, maintenance and verification

The catalog derives canonical names, layer, collection, mapped Figma name, type, usage, units, aliases and resolved values from token code. Primitives map to a shared Default collection; Semantic maps to Light/Dark. Alias keys must become actual Figma variable IDs during a future write. Colors export as numeric RGBA; rem dimensions use a documented 16px baseline. Line-height ratios, em tracking and millisecond durations retain their units. Fonts require availability/mapping; typography needs text-style composition; shadows and easing need writer conversion.

| Command, from `landing-page/` | Purpose |
| --- | --- |
| `npm run design-system:generate` | Regenerate token CSS and the typed export from source. |
| `npm run design-system:docs` or `npm run build:studio` | Generate tokens/export, type-check, build both HTML entries and package source/download assets with freshness hashes. |
| `npm run design-system:check` | Check aliases, cycles, type/unit compatibility, mapped-name uniqueness, mode coverage, export/CSS freshness, 28 contrast pairs per theme and documentation artifact freshness. |
| `npm run build` | Build the landing page. |

The artifact manifest detects stale inputs and generated outputs without accepting them silently. Contrast checks cover declared pairs, not every screen composition. After regeneration, inspect both themes and mobile layout; exercise navigation, theme persistence, menu focus/Escape and changed live controls. This document does not replace that QA.

Figma is not connected: no target file or verified writer is configured, and no external write or recurring sync is enabled. The intended direction is code → Figma. Local export readiness does not establish library or component parity.

### Composer attachment modal

The composer + is labeled Add attachment and opens an iOS-mode `IonPopover` aligned with + above the composer, contained inside the phone frame. Camera, Photo and File use `IonItem` actions in an `IonList`, stacked vertically as full-width 56px rows with leading icons and subtle dividers. Retain the existing phone surfaces and visible focus. Keep the title visually hidden and track composer/phone resizing through the shared popover adapter. Escape and backdrop dismiss; focus returns to +. Map and composer are inert while open, and focus cycles within the modal. Up/Down move between choices; Home/End reach the first/last choice. The short appearance transition starts at + and respects reduced motion. Camera opens the existing capture study. Photo restricts the native picker to images; File uses the native file picker. Selected metadata is attached to the current conversation without losing its draft. Uploaded photo/file identity and sent snapshots survive reload. This mockup stores metadata only and does not parse/upload file contents.

## New mockup foundation: iOS 18

The September 24 foundation preview is `landing-page/ios-foundation.html`, served by `npm run dev:foundation` at `http://127.0.0.1:5178/ios-foundation.html`. Build it with `npm run build:foundation`. This separate entry reuses the existing React/Vite project, generated brand theme, Ionic setup, `IosButton`, and `IosPopover`. It does not import the previous product mockup or read its saved conversations. The existing Studio remains available at `design-preview.html` during development.

The target is iOS 18. The foundation follows the `ios-web-foundation` skill: semantic local styles, native layout proportions, system typography, and no Figma runtime dependency. Glacier + Oxblood remains the approved palette. System text applies to this iPhone preview; the marketing typography remains unchanged. Existing Ionic components are retained as compatible project infrastructure. The outer preview uses the existing shadcn-style Button. No new UI or icon library is installed.

`src/design-system/ios-tokens.css` is the iOS component-role extension to the existing generated theme, not a replacement palette. It maps backgrounds, labels, fills, separators, tint, destructive, and success roles onto existing semantic colors. The theme provides light/dark values; iOS geometry, the eleven type roles, material parameters, and motion aliases live in this extension. The app's CSS entrypoint imports the existing Studio stylesheet once, which imports the shared theme once. Do not edit generated `tokens.css`.

`IOSScreen` in `components/ui/ios-screen.tsx` owns safe areas and one scroll region. The screen shell applies top and bottom safe-area padding once, outside the app header and footer boxes. `IOSNavBar` composes Ionic toolbar/title/buttons. Lists use existing Ionic list/item/label/note primitives directly. `IPhoneFrame` in `prototype` contains decorative system chrome and the preview dimensions; the app is independently usable without it. Widths at or below 700px use a full browser viewport with real environment insets, no simulated status bar, and no bezel. `viewport-fit=cover` is enabled without restricting zoom.

The existing popover adapter receives the new phone owner and anchor refs. Its portal is placed inside that owner; background app content becomes inert while open. Ionic retains dismissal and focus restoration; the preview adds the existing `trapFocus` helper around its dialog content to keep Tab and Shift+Tab contained, with an explicit dialog label and inert app/preview controls. About/Done provides a concrete overlay exercise in the preview, alongside a working appearance toggle, primary and secondary action feedback, disabled state, semantic swatches, and typography specimens. This page is a development inspection surface, not a product flow. A keyboard specimen now supplies a plain textarea for testing input; no sheets, maps, or backend services are connected.

Read-only Figma inspection on September 24 confirmed the selected root `507:24670` is the Activity views canvas, not a universal component. Individual contexts and screenshots were retrieved for navigation `1:54520`, large filled button `5:108579`, and regular list row `550:50627`. Measured values include the 54px simulated top region, 44px toolbar/list minimum, 16px row inset, 50px large action with 12px corners, and 17/22 body text. Existing local status SVGs match the previously exported source nodes. Optional search fields, sample images, and list accessories are not enabled in this preview. Brand colors deliberately replace the kit's blue tint.

The remaining type sizes are conventional iOS role approximations pending individual Figma typography inspection. Device bezel/shadow, preview composition, opaque material fallback, and the 8px spacing rhythm are local presentation decisions. The HIG typography/layout URLs were consulted but returned JavaScript-only content through the web reader; no unseen guidance is claimed as verified. Do not treat this component preview as native Safari or software-keyboard validation.

### Keyboard specimen

The foundation preview now includes a labeled textarea and a desktop iOS 18 keyboard simulation. Open `ios-foundation.html?keyboard=1` or use Show keyboard. `prototype/KeyboardPreview.tsx` reuses the existing `IosButton` and local keyboard glyph exports. Letters, shift, numbers, a small emoji set, space, return, and delete are functional. Escape from the focused input dismisses the keyboard; its accessory row has no custom Hide keyboard button. Physical typing also works. Touch devices use their OS keyboard. Dictation is visibly disabled and predictive suggestions are omitted. The keyboard geometry was rechecked against Figma `106:59544`; keycaps are 42px tall within 44px vertical targets, with 4.6px corners and 54px row pitch. Narrow character keys follow the platform reference. Neutral keyboard colors are scoped to the simulation.

The desktop iPhone outer frame is exactly 402 × 874 CSS pixels, including its 10px bezel, with border-box sizing. The inset screen is 382 × 854 CSS pixels. These dimensions remain fixed with the simulated keyboard open or closed. Short desktop windows scroll the surrounding page; mobile widths retain the responsive full-viewport layout.

Simulated status-bar and home-indicator layers use dedicated `--ios-system-foreground` and `--ios-system-background` tokens: black on white in light appearance, white on black in dark appearance. They are siblings of the app owner, independent of brand text and header blur. The home region matches the neutral keyboard surface while the keyboard is open. The app owner isolates overlay stacking below system chrome. Simulated chrome stays hidden on unframed mobile layouts.

The phone uses a local 40 × 40 SVG mouse cursor with a centered 20/20 hotspot. Pointer events scope it to mouse input inside the display, including Ionic shadow parts and overlays; the surrounding desktop retains its normal cursor. Ionic hover overlays and clear/outline button hover opacity are disabled inside the phone. Pressed feedback, disabled states, and keyboard focus remain intact.

### Workspace drawer

The foundation entry now has a left modal drawer outside the phone. Its top selector switches between Mockup (the current foundation), Landpage (the existing marketing page), and Design system (the existing documentation) using the view query parameter. Landpage runs in a titled same-origin iframe. Design system renders directly in the workspace with its own sidebar and mobile menu omitted; the shared workspace drawer contains every section link. The foundation build includes all three HTML entries. Mockup state stays mounted across view switches.

Light, Dark, and System controls are pinned to the drawer bottom. The shared useAppearance hook reuses placewise.studio.theme, follows system color-scheme changes, and syncs across same-origin documents through storage events. The drawer uses the existing shadcn-style Button and native dialog/select, with Escape, backdrop dismissal, focus trapping/restoration, scroll locking, and reduced-motion support. Phone hover/cursor rules remain scoped inside its display.

Design direction: the existing Placewise palette/buttons are the visual target; drawer layout and control placement come from the user's brief. Refero live research was unavailable (subscription inactive); bundled craft guidance informed labeled native controls, focus behavior, and URL navigation. No new dependencies were added.

Design-system section metadata lives in src/design-system/navigation.ts and serves both standalone documentation and the workspace drawer. Selecting Design system keeps the drawer open to reveal its grouped section list. Section links use #ds- hashes, expose the active page, and close the drawer with focus on the documentation heading. The section list scrolls independently between the pinned view selector and theme controls. Standalone design-preview.html retains its original navigation.
