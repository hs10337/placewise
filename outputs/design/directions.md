# Placewise visual directions

September 12, 2026. Concept exploration, not an approved design system or live product. Product scope follows the evolving `docs/product.md`; presentation follows `landing_page_principles.md`. Re-read the PRD before implementation. The preview uses curated example answers and an explicitly illustrated map.

The PRD changed during this pass. It now confirms area exploration with optional preferences, up to five suggested places, editable groups and local exploration history. The studies compare visual treatments of the single-place question flow. In the selected full landing page, add an area-discovery demonstration before the deeper follow-up exchange, and use positioning that includes both paths. Suggested groups must never imply a route or timetable.

## 01: Field Notes, recommended

Visual thesis: warm paper, expressive editorial type and a generous photograph make a place feel worth understanding.

Content plan: a full-width map-and-photo hero with one question and answer, a short follow-up exchange, a plain explanation of sources and a working prototype invitation when available.

Interaction thesis: a quiet entrance reveals the place before its question; selecting a map pin updates the adjacent answer; a scroll transition connects the photograph to its map context.

Composition uses a calm reading column beside a large image and map. Fraunces gives the brand a distinctive voice; Manrope keeps controls and answers legible. Paper, slate and terracotta connect to the existing principles. The risk is looking like a travel journal if questions and follow-ups disappear below the fold.

## 02: Living Atlas

Visual thesis: a pale, tactile city model turns geography into an object you want to explore.

Content plan: a spatial map hero, a selected place and question, a flat map-and-chat demonstration, then evidence and the next action.

Interaction thesis: pointer movement changes map perspective slightly; selecting a point anchors its question; scrolling settles the spatial scene into a readable map. The concept preview demonstrates perspective and selection; the full scroll transformation remains proposed.

Oversized sans-serif type, olive ink, muted water and pale terrain create a restrained system. A photograph connects the illustration to a real place. This is the most distinctive map direction, but the most expensive to tune for mobile performance and accessible controls. A detailed 3D scene must stay optional, with a complete flat-map alternative.

## 03: Open Window

Visual thesis: an edge-to-edge photograph, deep slate and large quiet type make the visitor feel present in the city.

Content plan: a photographic hero with a visible sourced answer, a map reveal, a follow-up demonstration and a concise invitation.

Interaction thesis: photography enters with a slow, small reveal; pin selection changes the answer; scrolling hands attention from image to map. The preview shows the photographic hierarchy, pin selection and answer transitions; the full handoff remains proposed.

Ivory typography and one warm accent sit against the city. This has the strongest immediate atmosphere, but photography can obscure the map-and-question product or suggest a destination campaign. Keep a real question visible and move quickly into interaction.

## Recommendation

Build from Field Notes and borrow the Living Atlas transition from place to map. Keep one visual identity throughout. Composition, source quality and a few clear motions matter more than the number of dependencies.

## Proposed implementation resources

Use the PRD's React, TypeScript, Vite and Tailwind direction, with [shadcn/ui](https://ui.shadcn.com/docs) primitives for accessible controls. Use [Motion for React](https://motion.dev/docs/react) for entrances, selection, shared layout and scroll-linked transitions. These are proposed choices for the selected build, not packages installed by this concept preview.

Use [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) if the selected direction needs a coordinated pinned sequence that warrants a timeline. Avoid two animation systems controlling the same element. Use [Three.js](https://threejs.org/docs/) only if a true 3D scene materially improves the selected direction; CSS perspective is sufficient for the initial atlas study. Keep ordinary scrolling and reduced-motion behavior intact.

The PRD currently proposes [MapKit JS](https://developer.apple.com/documentation/mapkitjs) for the actual interactive product map. Verify provider styling, authorization and data-use constraints before integration. Do not mistake this illustration for a committed map-provider style or live global map.

Use Fraunces and Manrope as the proposed type pairing, a small coherent icon set, verified photography and custom cartographic composition. Do not add a generic animation-component collection to fill sections.

## Evidence and assets

The preview's Coit Tower and Telegraph Hill answers are condensed from [San Francisco Recreation and Parks](https://sfrecpark.org/Facilities/Facility/Details/Coit-Tower-290). Sources are linked beside the answers. They are curated examples, not live AI results.

Photography: Sasha / @sanfrancisco, [Coit Tower From Above](https://commons.wikimedia.org/wiki/File:Coit_Tower_From_Above_(Unsplash).jpg), listed as CC0, with license review visible on the source page. Displayed remotely with credit; no local media download. The map illustration is original schematic artwork and is not navigational geography.

## Verification

Verify all three directions at desktop and phone widths, keyboard concept switching, both place selections, follow-up and reset controls, image loading and reduced-motion styles. Keep design-review controls outside the depicted product. Record actual results in `qa.md` after inspection.
