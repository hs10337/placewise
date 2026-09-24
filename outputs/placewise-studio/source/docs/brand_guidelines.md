# Placewise brand guideline

Version 0.4.1 · September 14, 2026 · Agent-facing draft

Preserve the user-approved Glacier + Oxblood palette and personality: **curious and thoughtful, with a little wit**. The shared foundation implements this palette in light and dark modes. Treat the detailed rules below as draft guidance; distinguish implemented choices from approved identity decisions. Follow the [PRD](product.md) for product scope.

## 1. Brand Core

Present Placewise as a map-based way to understand places through questions. Address curious, independent travelers while including locals, new residents and remote explorers. Explain both entry paths: explore a small group of places around personal interests, or select a point and ask without knowing its name. Make the experience feel observant, approachable and trustworthy, helping people understand their surroundings with less searching and switching.

## 2. Brand Principles

**Start with the place.** Give each composition a clear geographic subject. Keep the selected place visible beside its answer. Lead with what someone can learn; explain AI where it helps people understand how answers work.

**Make curiosity concrete.** Use questions about a visible detail, local name or practical need. Show an answer early. Include everyday streets and businesses alongside landmarks so the brand invites ordinary curiosity.

**Respect attention.** Give a concise first answer and let follow-ups provide depth. Keep forms short and preferences optional. Preserve a clear path back to the map, with location context intact.

**Make trust visible.** Put source links near supported claims. State uncertainty directly. Distinguish facts about the selected site from surrounding-area context and suggestions based on a person's interests.

**Let the place carry the interest.** Use quiet surfaces and restrained controls around vivid, relevant place content. Reserve wit for observations and invitations; keep practical answers, errors and missing evidence plain.

## 3. Voice & Tone

Use active verbs, familiar words, contractions and short paragraphs. Put the useful information first. Use sentence case for headlines, labels and buttons. Write **Placewise** in prose; preserve local place names and scripts. Avoid em dashes, corporate phrasing, excessive exclamation marks and jokes in recovery messages.

Prefer “place,” “area,” “neighborhood,” “ask,” “explore,” “understand” and “sources.” Use “story” only when relevant. Avoid “hidden gems,” “must-see,” “ultimate,” “unlock” and “AI-powered travel companion.” Keep history, architecture and practical questions equally welcome.

**Draft headline:** “Get to know a place.” Support it with “Explore an area around your interests, or pick a point on the map and ask. Follow your questions with sources you can check.”

**Draft expressive line:** “A little context changes the view.” Pair it with a specific place, question and answer. Both lines remain proposed copy.

**Invitation example:** “‘What's that?’ is a perfectly good place to start.” Use lightness to explain the direct-question entry path.

**Missing-evidence example:** “I couldn't verify what this building was used for.” Follow with supported context, clearly scoped.

**Recovery example:** “The answer didn't finish. Your question is still here.” Use only when the draft is preserved; offer an available retry action.

Use **“Explore the example”** for the current prepared demonstration. Use **“Start exploring”** once the working prototype is available. Say **“Saved in this browser”** only after a successful save, and explain potential loss when browser data is cleared.

## 4. Visual Language

**Composition.** Use spacious layouts with one dominant place, question or answer. Keep map and conversation adjacent on desktop and connected through an expandable sheet on mobile. Follow an 8px spacing rhythm. Give sources, active place labels and the composer clear space.

**Typography.** Use the approved Bricolage Grotesque at 600 for prominent headlines and the wordmark study. Use Instrument Sans at 400 for answers, 500 for controls and 600 for interface headings. Keep Bricolage upright; it has no italic face. Use the implemented display, title, heading, body, label and caption roles from [the token source](../landing-page/src/design-system/tokens.json). Body text starts at 16px with 1.6 line height. Keep reading text in Instrument Sans even when a headline is expressive. Final logo treatment remains TBD.

**Color and shape.** Use pure white for the light-mode canvas and reading surfaces, with faint Glacier on secondary and selected surfaces. Reserve stronger Glacier for compact interactive emphasis and restrained details. Use Oxblood lettering and action fills, white text on light-mode Oxblood actions, and sparse Peach details. In dark mode, use the lighter Oxblood action fill with dark Oxblood text; use cool dark surfaces and light text for reading. Peach remains a detail rather than a default action or status color. Reinforce selection with labels or shape. Use the existing 8px base component radius and quiet borders. Keep larger compositions open instead of wrapping every fragment in a card.

**Controls.** Use shadcn/ui primitives and the existing primary, secondary and ghost hierarchy. Keep reusable primitives in `components/ui` and shared helpers in `lib`. Preserve hover, focus and disabled states, accessible labels, contrast and keyboard operation. Keep controls usable without hover.

**Imagery and identity.** Use correctly identified photographs of streets, buildings and ordinary life, retaining credits and alt text. Use category icons for businesses and honest missing-image fallbacks. Retain the current Lucide interface vocabulary. Treat the lowercase wordmark, compass and trailing period as provisional. Final logo and app-icon assets are TBD.

**Motion.** Let the immersive introduction reveal interest points as people scroll and explanations when they select a point. Preserve ordinary scrolling, keyboard access and a complete reduced-motion experience. Label staged or fictional scenes clearly. Keep the relationship between selection and explanation understandable without animation.

## 5. Design Tokens

The authoritative [token source](../landing-page/src/design-system/tokens.json) contains primitive values and semantic roles for light and dark modes. [theme.css](../landing-page/src/theme.css) imports the generated CSS. Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for token usage, state pairings and generation commands.

The approved palette anchors remain Glacier `#D9F2F4`, Oxblood `#592338`, Peach `#FF9479` and pure white `#FFFFFF`. The extended palette supplies tonal steps and feedback colors. In light mode, `--background` and `--card` use white; `--secondary` and `--accent` use faint glacier-50. Semantic aliases choose the correct value for each mode. Use `--foreground` for text, `--primary` with `--primary-foreground` for primary actions, `--brand-accent` for Peach details, and `--ring` for focus. Do not use primitive colors directly in product component CSS.

Use the implemented spacing, type, radius, size, shadow and motion roles. Build on the 8px spacing rhythm with 4px for compact gaps. The component token layer is deliberately deferred until components require their own stable contracts. Compatibility aliases for old theme names are not new brand vocabulary.

## 6. Guardrails & Anti-Patterns

**Never** fabricate place identities, facts, citations, photos, testimonials or coverage claims. Never use generated or unrelated imagery as documentary evidence of an actual place. Never imply that suggestions form a route, timetable or ranking. Never silently replace Glacier + Oxblood, introduce undocumented brand colors or treat legacy Teal Mist as the approved direction.

**Never** present planned functionality as available. As of this draft, the landing page is a prepared example; live maps and AI answers belong to the planned web prototype. Native iOS, accounts and device sync come later. Global selection does not guarantee complete answers. Browser-local history does not mean requests are processed entirely on the device.

**Avoid** luxury-travel styling that makes ordinary streets feel out of scope, generic AI graphics, decorative feature-card grids, competing bright map colors and excessive badges. Avoid overusing “little,” “magical” or “story.” Keep uncertainty and source limitations visible.

**Prefer** typography and spacing for hierarchy, one strong visual subject, real neighborhood context and concise sourced answers. Preserve the user's agency to choose places and follow questions. Ask about material conflicts instead of inventing approval.

## 7. Canonical References

Glacier + Oxblood, Bricolage Grotesque with Instrument Sans, and the personality are user-approved directions. No finished screen or final logo is recorded as approved canonical work. Use these verified local references for the stated purpose; do not copy every detail as a brand rule.

| Reference | What to learn and status |
| --- | --- |
| [product.md](product.md) | Product scope, both exploration paths, source requirements and honest fallbacks. Product authority. |
| [theme.css](../landing-page/src/theme.css) | Shared entry for generated primitive and semantic tokens, including both theme modes. |
| [App.tsx](../landing-page/src/App.tsx) | Current map, place and answer relationships; prepared-demo disclosure. Implementation example. |
| [styles.css](../landing-page/src/styles.css) | Actual button pairings, focus, responsive composition and reduced motion. Tiny captions are not canonical. |
| [button.tsx](../landing-page/src/components/ui/button.tsx) | Reuse existing variants and primitive structure when extending actions. |
| [places.ts](../landing-page/src/lib/places.ts) | Structure concise place questions and answers with nearby source metadata; recheck facts before reuse. |

Treat [earlier visual studies](../outputs/design/directions.md) and the [Primland variant](../landing-page/primland-inspired/README.md) as experiments. Their alternate palettes and type pairings do not override the approved palette and typography.

**Agent decision hierarchy:** Within product and task requirements, follow current explicit user instructions, approved canonical references when available, existing design tokens, brand guardrails, brand principles, existing product patterns, then generic conventions. Follow this guideline when generic conventions conflict. Ask when a material contradiction remains; keep unknowns labeled TBD.
