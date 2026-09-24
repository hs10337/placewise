# Placewise landing page principles

Generation brief combining the [product PRD](../docs/product.md) with visual lessons from the [North America research report](outputs/competitor-website-executive-summary.html), researched September 10, 2026. Aligned with the PRD on September 12, 2026. Visual values below are proposed defaults.

## Living product direction

The PRD governs product behavior, scope and claims; this file guides landing-page presentation. The PRD is being edited in parallel. Re-read it before each build milestone and final copy review, adjust affected sections, and preserve concurrent edits. Keep detailed requirements in the PRD. Distinguish confirmed scope from proposed technical defaults and future capabilities. Flag conflicts that remain unclear.

## Purpose and positioning

Help curious travelers and residents understand an area or a specific place. Area exploration uses optional preferences to suggest a small group of places that users can refine. Direct curiosity starts by selecting any point and asking a question. Keep the active area, preferences and selected place clear. Everyday streets and neighborhoods are strong examples; remote exploration is equally valid.

North America is the initial audience and research lens. The product allows selection anywhere in the world, including unnamed points. Do not imply a launch-city allowlist or equally complete answers everywhere.

Suggested broad headline: **Find places that spark your curiosity.** Supporting copy: **Explore an area around your interests, or pick any spot and ask. Follow answers with sources you can check.** The narrower **Ask about any place** headline fits a concept focused on direct questions. The full landing page must explain both entry paths and show one worthwhile answer immediately.

Phase 1 is a working web prototype without accounts. Explorations, preferences, editable place groups and conversations are saved in the current browser. Native iOS, accounts and synced history come later. Do not present planned capabilities as available.

## Design direction

Create a warm, urban editorial experience. Combine a quiet map, one visible place context and a readable question and answer. Use a verified neighborhood photograph where it helps. Give the answer emphasis while preserving its geographic context.

| Reference | Principle to adapt |
| --- | --- |
| [Autio](https://autio.com/) | Connect imagery, geography and a specific story in one composition. |
| [ExploreHere](https://explorehere.app/) | Make spontaneous discovery desirable through coherent color, texture and real places. |
| [Lewa House](https://lewahouse.com/explore/) | Keep the selected location visible when its story opens. |
| [San Rita](https://sanrita.ca/en) | Use restrained cartographic colors and clearly separated map controls. |
| [VoiceMap](https://voicemap.me/), [Clio](https://theclio.com/) and [On This Spot](https://onthisspot.ca/) | Show a concrete preview and checkable sources with clear attribution. |

Borrow these principles without reproducing proprietary layouts, illustrations or copy. The research supports design hypotheses, not proven conversion improvements.

## Hero and composition

Use a spacious desktop split: concise copy and actions beside a map and adjacent conversation panel. Show one selected point, a question, a concise sourced answer and a follow-up invitation. Keep the first answer readable in the initial viewport, outside decorative phone frames.

Use one North American neighborhood as the landing-page example, without changing the product's global entry behavior. Subdue secondary streets and pins. Use one accent for selection and the primary action. Separate the headline, controls and answer visually.

On mobile, show the promise and example early, with an expandable conversation sheet. Keep active place context and the composer legible when the keyboard opens. Collapsing chat preserves selection, draft and conversation.

## Visual defaults

| Element | Starting direction |
| --- | --- |
| Color | Warm paper `#F4F1E9`, dark slate `#172F31`, terracotta `#B9482E`. Use muted greens and blues for map context. Validate contrast in actual combinations. |
| Typography | A readable editorial serif for headlines and a plain sans-serif for body text and controls. Maximum two families; Georgia and the system sans-serif are suitable initial fallbacks. |
| Reading | Body text 16–18px, comfortable line height and roughly 45–65 characters per line. Keep map labels secondary but legible. |
| Spacing | Follow an 8px rhythm, generous section spacing and consistent alignment. Use whitespace to establish hierarchy. |
| Imagery | Real streets, buildings, local details and people. Use historical comparisons only where relevant and sourced. |

Keep one dominant composition per section. Avoid generic feature-card grids, excessive badges, decorative handwriting in body text and competing bright map colors.

## Homepage sequence

| Section | Visitor outcome |
| --- | --- |
| Hero with a question and sourced answer | Understand Placewise and learn something immediately. |
| Explore an area | See optional interests, a small suggested group and why each place belongs. |
| A short follow-up exchange | See how curiosity deepens while the place stays in context. |
| How exploration works | Understand both area discovery and immediate questions about any point. |
| Evidence and honest limits | Check sources and understand missing identity or evidence. |
| Prototype invitation | Start exploring when the working prototype is available. |
| Short FAQ and footer | Understand browser history, location permission, connectivity and current availability. |

Keep navigation short. Avoid adding pricing, partner programs, contributor platforms or coverage directories without a product decision supporting them.

## Actions and interaction

Preferred primary action when the prototype works: **Start exploring**. Secondary action: **See an example**. Until then, the example is the primary working action and must be clearly presented as a demonstration. Show download or waitlist actions only when confirmed and functional.

Location access follows an explicit **My location** action. Denied permission must not block map exploration. Provide accessible map movement and **Select map center**. Panning never silently changes selection. Starter questions fill an editable composer before sending.

Keep each conversation attached to one place. Different places open separate conversations. Support named landmarks, businesses and unresolved coordinates. Missing identity or photography must not block questions or silently substitute a nearby attraction.

For area discovery, show up to five suggestions with supported reasons and optional preferences. Users can keep, remove or add places and explicitly update suggestions. A group is unordered: no implied route, schedule or promise that all stops fit the user's available time. Keep place conversations separate when grouping them.

## Motion and effects

Use motion to explain selection and the connection between a pin and its story. Start with restrained opacity and position transitions around 200–350ms; this is a proposed range, not a measured competitor behavior.

Preserve normal vertical scrolling. Avoid mandatory globe flights, long introductions, automatic horizontal travel, autoplay audio and constantly moving hero content. Respect reduced-motion preferences and keep the experience complete with animation disabled. Show useful content before loading optional map engines or video.

## Content and trust

Each sample needs explicit place context, a question, a concise answer and sources that support its claims. Use verified names or honest coordinate context. Landmark photos are optional and require usage rights, attribution and alt text; businesses use category icons. Never substitute generated or unrelated photos as documentary evidence.

State uncertainty and distinguish district-level evidence from claims about an exact site. Do not invent facts, testimonials, ratings, usage totals or availability. Preference-based place suggestions are in scope; exhaustive rankings, booking recommendations, automatic navigation, itineraries, audio guides and offline answers or maps are not. Explain browser-local history without suggesting that AI requests stay on the device.

## Build and acceptance

Use shadcn/ui primitives where applicable, styled to this visual direction. Prefer existing components; place reusable primitives in `components/ui` and shared helpers in `lib`. Keep implementation details out of visitor-facing copy.

Provide semantic headings, labeled inputs, keyboard-operable pins and panels, visible hover/focus/disabled states and accessible contrast. Restore focus after closing an overlay. Keep controls comfortably tappable and prevent overlays from covering key actions.

Before delivery, verify desktop and phone layouts, scrolling, slow loading, area discovery and the select, ask, answer and follow-up demonstration. Check implemented preferences, group editing, location and fallback states. Reconcile every product claim with the latest PRD and actual availability. A new visitor should understand both exploration paths and reach a sourced example without an account. These are validation goals, not established results.
