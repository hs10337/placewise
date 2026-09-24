# Placewise brand guideline

Version 0.2 · September 14, 2026 · Agent-facing draft

Preserve the user-selected Teal Mist foundation and personality: **curious and thoughtful, with a little wit**. Treat the detailed rules below as draft guidance; distinguish implemented choices from approved identity decisions. Follow the [PRD](PRD_DRAFT.md) for product scope.

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

**Typography.** Retain the implemented Georgia headlines and Inter body/control pairing. As draft sizing guidance, use 16–18px reading text with comfortable line height. Keep source links legible on phones. Do not treat the demo's tiny captions as canonical sizing. A final display face and complete type scale are TBD.

**Color and shape.** Use cool light surfaces, deep teal text and restrained mint accents. Reserve the strongest accent for actions and selection; reinforce selection with labels or shape. Use the existing 8px base component radius and quiet borders. Keep larger compositions open instead of wrapping every fragment in a card.

**Controls.** Use shadcn/ui primitives and the existing primary, secondary and ghost hierarchy. Keep reusable primitives in `components/ui` and shared helpers in `lib`. Preserve hover, focus and disabled states, accessible labels, contrast and keyboard operation. Keep controls usable without hover.

**Imagery and identity.** Use correctly identified photographs of streets, buildings and ordinary life, retaining credits and alt text. Use category icons for businesses and honest missing-image fallbacks. Retain the current Lucide interface vocabulary. Treat the lowercase wordmark, compass and trailing period as provisional. Final logo and app-icon assets are TBD.

**Motion.** Let the immersive introduction reveal interest points as people scroll and explanations when they select a point. Preserve ordinary scrolling, keyboard access and a complete reduced-motion experience. Label staged or fictional scenes clearly. Keep the relationship between selection and explanation understandable without animation.

## 5. Design Tokens

Use the actual light-theme declarations from [theme.css](../landing-page/src/theme.css), shown below as implemented values. Preserve names and aliases. This snapshot records the chosen theme's current implementation; it does not approve every component treatment.

```css
:root {
  --background: #f9fdff;
  --foreground: oklch(0.201 0.031 210.206);
  --card: #ffffff;
  --card-foreground: var(--foreground);
  --popover: #ffffff;
  --popover-foreground: var(--foreground);
  --primary: oklch(0.704 0.14 182.503);
  --primary-foreground: oklch(0.991 0 0);
  --secondary: #e4f2f2;
  --secondary-foreground: oklch(0.401 0.04 210.356);
  --muted: #ebf4f4;
  --muted-foreground: oklch(0.5 0.03 211.798);
  --accent: #c3ecdf;
  --accent-foreground: oklch(0.452 0.077 194.769);
  --destructive: #ce514d;
  --border: #dae3e4;
  --input: #dae3e4;
  --ring: var(--primary);
  --radius: 0.5rem;
  --spacing: 0.25rem;
  --font-sans: Inter, sans-serif;
  --font-serif: Georgia, serif;
  --letter-spacing: 0em;
  --action-foreground: #062b2b;
  --ink-teal: #075e59;
  --deep-teal: #073f3d;
}
```

Pair `--primary` with **`--action-foreground`** for primary buttons. The near-white `--primary-foreground` remains in the source theme but is not the implemented button text color. The current focus outline uses `--ink-teal`, while `--ring` aliases `--primary`; preserve visible focus when extending components. Check contrast in actual states before claiming accessibility.

Keep the 4px base `--spacing` token while composing layouts on an 8px rhythm. Global layout-width and section-spacing tokens, a complete type scale and a dark theme are **TBD**. Existing per-selector measurements are implementation examples; do not invent global token names or precise values for undecided roles.

## 6. Guardrails & Anti-Patterns

**Never** fabricate place identities, facts, citations, photos, testimonials or coverage claims. Never use generated or unrelated imagery as documentary evidence of an actual place. Never imply that suggestions form a route, timetable or ranking. Never silently replace Teal Mist or introduce a brand color without updating the documented token system.

**Never** present planned functionality as available. As of this draft, the landing page is a prepared example; live maps and AI answers belong to the planned web prototype. Native iOS, accounts and device sync come later. Global selection does not guarantee complete answers. Browser-local history does not mean requests are processed entirely on the device.

**Avoid** luxury-travel styling that makes ordinary streets feel out of scope, generic AI graphics, decorative feature-card grids, competing bright map colors and excessive badges. Avoid overusing “little,” “magical” or “story.” Keep uncertainty and source limitations visible.

**Prefer** typography and spacing for hierarchy, one strong visual subject, real neighborhood context and concise sourced answers. Preserve the user's agency to choose places and follow questions. Ask about material conflicts instead of inventing approval.

## 7. Canonical References

Teal Mist and the personality are user-approved directions. No finished screen or final logo is recorded as approved canonical work. Use these verified local references for the stated purpose; do not copy every detail as a brand rule.

| Reference | What to learn and status |
| --- | --- |
| [PRD_DRAFT.md](PRD_DRAFT.md) | Product scope, both exploration paths, source requirements and honest fallbacks. Product authority. |
| [theme.css](../landing-page/src/theme.css) | Exact implemented colors, font roles and geometry for the selected theme. |
| [App.tsx](../landing-page/src/App.tsx) | Current map, place and answer relationships; prepared-demo disclosure. Implementation example. |
| [styles.css](../landing-page/src/styles.css) | Actual button pairings, focus, responsive composition and reduced motion. Tiny captions are not canonical. |
| [button.tsx](../landing-page/src/components/ui/button.tsx) | Reuse existing variants and primitive structure when extending actions. |
| [places.ts](../landing-page/src/lib/places.ts) | Structure concise place questions and answers with nearby source metadata; recheck facts before reuse. |

Treat [earlier visual studies](../outputs/design/directions.md) and the [Primland variant](../landing-page/primland-inspired/README.md) as experiments. Their alternate palettes and type pairings do not override Teal Mist.

**Agent decision hierarchy:** Within product and task requirements, follow current explicit user instructions, approved canonical references when available, existing design tokens, brand guardrails, brand principles, existing product patterns, then generic conventions. Follow this guideline when generic conventions conflict. Ask when a material contradiction remains; keep unknowns labeled TBD.
