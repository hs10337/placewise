# Placewise brand guidelines

Version 0.5.0 · September 24, 2026 · Working draft

This edition follows the chapter and subsection structure of the user-supplied OpenAI Brand Guidelines, September 2022. The reference supplies the framework, not Placewise’s identity, assets or specifications. Data visualization is numbered consistently as chapter 7.

**Approved** identifies an explicit identity decision. **Implemented** identifies an existing product choice, not final brand approval. Other existing guidance remains **draft guidance**. **To be defined** marks missing information; it is not permission to invent a specification. Follow the [PRD](product.md) for product scope.

## Mission

**To be defined:** the final approved mission statement.

Existing product purpose: help people understand places through map-connected questions. This is context for the guidelines, not a newly approved mission statement.

## 1.0 Introduction

A map-based way to understand places. Curious and thoughtful, with a little wit.

### 1.1 Purpose

Present Placewise as a map-based way to understand places through questions. Address curious, independent travelers while including locals, new residents and remote explorers. Explain both entry paths: explore a small group of places around personal interests, or select a point and ask without knowing its name. Help people understand their surroundings with less searching and switching. The PRD remains the authority for product scope.

### 1.2 Brand values

**Approved personality:** curious and thoughtful, with a little wit. The experience should feel observant, approachable and trustworthy.

**Start with the place.** Give each composition a clear geographic subject. Keep the selected place visible beside its answer. Lead with what someone can learn; explain AI where it helps people understand how answers work.

**Make curiosity concrete.** Use questions about a visible detail, local name or practical need. Show an answer early. Include everyday streets and businesses alongside landmarks.

**Respect attention.** Give a concise first answer and let follow-ups provide depth. Keep forms short and preferences optional. Preserve a clear path back to the map with location context intact.

**Make trust visible.** Put source links near supported claims. State uncertainty directly. Distinguish selected-site facts from surrounding-area context and suggestions based on interests.

**Let the place carry the interest.** Use quiet surfaces and restrained controls around vivid, relevant place content. Reserve wit for observations and invitations; keep practical answers, errors and missing evidence plain.

## 2.0 Logo

The identity has a direction. The final logo is still to be defined.

### 2.1 Introduction

**To be defined:** the approved logo concept, final artwork and downloadable asset package. The lowercase wordmark, compass and trailing period are provisional studies. Do not treat an implemented masthead as approved logo artwork.

### 2.2 Logomark

**To be defined:** the standalone symbol, construction and approved variants. The existing compass study is provisional.

### 2.3 Logotype

The wordmark study uses the approved Bricolage Grotesque at 600. Write Placewise in prose.

**To be defined:** final letterforms, capitalization, spacing and outlined artwork. Typeface approval does not establish an approved logotype.

### 2.4 Lockup

**To be defined:** relationships between the symbol and logotype, orientations, proportions and alternate lockups.

### 2.5 Clearance

**To be defined:** the clearspace unit, minimum exclusion zone and diagrams. Do not borrow measurements from the reference brand.

### 2.6 Color

The approved brand palette is available in chapter 3.

**To be defined:** approved logo colorways, monochrome and reversed versions, and acceptable backgrounds. Palette approval does not approve every logo color combination.

### 2.7 Minimum sizes

**To be defined:** tested minimum digital and print sizes for each logo configuration.

### 2.8 Placement

**To be defined:** placement rules for product, web, print and co-branded contexts, with examples.

### 2.9 Avatar

**To be defined:** the final app icon, social avatar, safe area, crops and export sizes.

### 2.10 What to avoid

Never present provisional studies as final assets or reuse the reference brand’s logo. Preserve Placewise’s approved palette and typography.

**To be defined:** an illustrated misuse sheet for the final logo, including distortion, recoloring, effects and altered relationships.

## 3.0 Color

Cool space. Warm character. Four approved palette anchors, with product roles that adapt by theme.

### 3.1 Introduction

**Approved anchors:** Glacier `#D9F2F4`, Oxblood `#592338`, Peach `#FF9479` and pure white `#FFFFFF`. These are identity swatches. Product surfaces use semantic tokens from the extended tonal palette.

**To be defined:** the formal primary, secondary and tertiary classification, print specifications and usage ratios. The sections below record existing roles without inventing that classification.

### 3.2 Primary

**Implemented roles:** pure white for the light-mode canvas and reading surfaces; Oxblood for lettering and primary actions, paired with white text in light mode.

**To be defined:** a formally approved primary color set, usage ratios, CMYK and spot-color values.

### 3.3 Secondary

**Implemented role:** faint Glacier on secondary and selected surfaces, with stronger Glacier reserved for compact interactive emphasis and restrained details.

**To be defined:** the formal secondary color classification and application examples.

### 3.4 Tertiary

**Existing guidance:** use Peach sparingly as a detail. It is not the default action or status color.

**To be defined:** the formal tertiary color classification and application examples. Do not add new colors to fill this section.

### 3.5 Supplemental

**Implemented:** the token source provides supporting neutral and feedback colors. They serve interface roles and do not expand the approved identity palette by implication.

**To be defined:** a separate supplemental brand palette, if needed.

### 3.6 Shades

**Implemented:** the authoritative token source defines tonal steps and semantic roles for both themes. Use `--foreground` for text, `--primary` with `--primary-foreground` for actions, `--brand-accent` for Peach details and `--ring` for focus. Light-mode `--background` and `--card` use white; `--secondary` and `--accent` use faint glacier-50. Do not hardcode primitive colors in product component CSS. Fixed color swatches may document identity values.

### 3.7 Color contrast

Use existing foreground/background token pairings. Check text, controls, focus indicators and selection states at their actual sizes in both themes. Reinforce selection with labels or shape; keep controls usable without hover.

**To be defined:** a published, measured contrast matrix of approved pairings and permitted text sizes. Palette selection alone is not a contrast compliance claim.

### 3.8 Themes

**Implemented light appearance:** pure white reading surfaces, faint Glacier supporting surfaces and Oxblood actions with white lettering.

**Implemented dark appearance:** cool dark surfaces, light reading text and lighter Oxblood action fills with dark Oxblood lettering. Semantic aliases choose the correct values.

**To be defined:** any additional editorial or campaign themes.

## 4.0 Typography

Character in the headline. Clarity in the answer.

### 4.1 Introduction

**Approved:** Bricolage Grotesque at 600 for prominent headlines and the wordmark study. Instrument Sans at 400 for answers, 500 for controls and 600 for interface headings. Use sentence case and keep reading text in Instrument Sans. Final logo treatment remains to be defined.

### 4.2 Serif

**To be defined:** whether Placewise needs a serif typeface and, if so, its family, role, weights and licensing. No serif is approved. Bricolage Grotesque is the display sans-serif; do not substitute it into this slot as a serif.

### 4.3 Sans-serif

Bricolage Grotesque brings character to prominent headlines. Instrument Sans supports clear, sustained reading and interface tasks.

**Implemented type roles:** display 48px, title 32px, heading 24px, body 16px, label 14px and caption 12px. Body text starts at 16px with 1.6 line height. Use the authoritative type tokens for product components. Presentation headlines may scale with the viewport while preserving readable line lengths.

### 4.4 Weights

**Approved:** Bricolage Grotesque 600; Instrument Sans 400 for reading, 500 for controls and 600 for interface headings. Bricolage stays upright and has no italic face. Do not synthesize unapproved weights or styles.

### 4.5 What to avoid

Avoid synthetic Bricolage italics, decorative font substitutions, dense text, weak contrast and oversized expressive type in answers. Do not treat small captions in older implementation examples as canonical. Preserve local place names and scripts.

## 5.0 Iconography

Familiar symbols. Clear meaning. A consistent interface vocabulary.

### 5.1 Introduction

**Implemented:** Lucide provides the general web interface vocabulary. Icons support clear labels, category recognition and honest missing-image fallbacks. An interface icon is not an approved brand logomark.

### 5.2 Grid

**To be defined:** a custom icon construction grid, keylines, safe areas and optical corrections. Preserve the chosen library’s native construction until a custom system is approved.

### 5.3 Weight

**To be defined:** a brand-wide icon stroke specification and size-dependent adjustments. Preserve established component and library behavior rather than deriving a new rule from the reference.

### 5.4 Scale

**Implemented foundation sizes:** 16px, 20px and 24px icons, with a 44px minimum touch target for interactive controls. Keep glyph size and hit area distinct.

### 5.5 Alignment

**To be defined:** formal optical alignment rules, baseline relationships and documented exceptions. Preserve existing component alignment in the meantime.

### 5.6 Style

Use a coherent vocabulary within each surface and retain accessible labels. Avoid combining unrelated decorative icon families.

**To be defined:** a custom style sheet for corners, caps, joins, filled states and visual corrections.

### 5.7 Library

**Existing direction:** Lucide for general web surfaces; Ionic and Ionicons for the iPhone prototype according to the PRD; native conventions for the later native app. Keep platform requirements explicit.

**To be defined:** a curated icon inventory, approved names and usage examples across platforms.

## 6.0 Photography

Let the real place be the interesting part.

### 6.1 Introduction

Use correctly identified photographs of streets, buildings and ordinary life alongside landmarks. Retain required credits, licensing information and useful alt text. Use category icons for businesses and honest missing-image fallbacks.

**To be defined:** an approved photography collection, commissioning brief and asset library.

### 6.2 Color

**To be defined:** grading, saturation, warmth, monochrome treatments and approved before/after examples. Do not import the reference brand’s photographic treatment.

### 6.3 Composition

Give each image a clear geographic subject. Include ordinary neighborhood context as well as recognizable landmarks.

**To be defined:** crop rules, aspect ratios, subject placement and approved composition examples.

### 6.4 Elements

**To be defined:** rules for grain, texture, blur, overlays and other photographic effects. No decorative treatment is approved by inclusion in the reference.

### 6.5 Light and shadow

**To be defined:** lighting direction, shadow treatment, exposure range and representative examples. Keep documentary place imagery truthful.

### 6.6 AI generated

Never use generated or unrelated imagery as documentary evidence of an actual place. Label staged or fictional scenes clearly. For a named landmark, use a verified photo or a neutral fallback. For a business, use a category icon. For an unidentified point, show coordinates rather than inventing an identity.

**To be defined:** any permitted non-documentary generative image style, disclosure treatment and approved examples.

## 7.0 Data visualization

A place for evidence. A chart system still to be defined.

### 7.1 Introduction

**To be defined:** chart use cases, principles, accessibility requirements and approved examples. No data visualization system is approved. Do not fabricate metrics to fill a specimen.

### 7.2 Grid lines and markers

**To be defined:** axes, tick marks, grid-line weight, marker shape, contrast and reference-line treatment.

### 7.3 Spacing

**To be defined:** plot margins, internal spacing, label offsets, legend placement and density limits. The product’s 8px rhythm alone does not settle chart spacing.

### 7.4 Primary colors

**To be defined:** the primary data-series palette, semantic meanings and tested contrast. The brand palette does not automatically define data-series assignments.

### 7.5 Secondary colors

**To be defined:** secondary series colors, sequential ramps and accessible differentiation beyond color alone.

### 7.6 Tertiary colors

**To be defined:** extended series colors, categorical limits and fallback encodings.

### 7.7 Lines

**To be defined:** line styles, stroke widths, markers, interpolation and differentiation between observed, estimated and comparative data.

### 7.8 Bar and column charts

**To be defined:** bar widths, gaps, grouping, stacking, axis baselines and labeling examples.

### 7.9 Line charts

**To be defined:** series limits, time axes, missing-data behavior, legends and labeling examples.

### 7.10 Area charts

**To be defined:** fill opacity, stacking, overlapping series and axis treatment.

### 7.11 Pie and donut charts

**To be defined:** permitted use cases, segment limits, labels, ordering and donut-center treatment.

## Appendix: Placewise-specific guidance

The reference’s seven chapters are the main presentation. These existing product and writing rules remain part of the guidelines.

### Voice and tone

Use active verbs, familiar words, contractions and short paragraphs. Put the useful information first. Use sentence case for headlines, labels and buttons. Write **Placewise** in prose; preserve local place names and scripts. Avoid em dashes, corporate phrasing, excessive exclamation marks and jokes in recovery messages.

Prefer “place,” “area,” “neighborhood,” “ask,” “explore,” “understand” and “sources.” Use “story” only when relevant. Avoid “hidden gems,” “must-see,” “ultimate,” “unlock” and “AI-powered travel companion.” Keep history, architecture and practical questions equally welcome.

**Draft headline:** “Get to know a place.” Support it with “Explore an area around your interests, or pick a point on the map and ask. Follow your questions with sources you can check.”

**Draft expressive line:** “A little context changes the view.” Pair it with a specific place, question and answer. Both lines remain proposed copy.

**Invitation example:** “‘What's that?’ is a perfectly good place to start.” Use lightness to explain the direct-question entry path.

**Missing-evidence example:** “I couldn't verify what this building was used for.” Follow with supported context, clearly scoped.

**Recovery example:** “The answer didn't finish. Your question is still here.” Use only when the draft is preserved; offer an available retry action.

Use **“Explore the example”** for the current prepared demonstration. Use **“Start exploring”** once the working prototype is available. Say **“Saved in this browser”** only after a successful save, and explain potential loss when browser data is cleared.


### Composition, controls and motion

**Composition.** Use spacious layouts with one dominant place, question or answer. Keep map and conversation adjacent on desktop and connected through an expandable sheet on mobile. Follow an 8px spacing rhythm. Give sources, active place labels and the composer clear space.

**Controls.** Use shadcn/ui primitives and the existing primary, secondary and ghost hierarchy. Keep reusable primitives in `components/ui` and shared helpers in `lib`. Preserve hover, focus and disabled states, accessible labels, contrast and keyboard operation. Keep controls usable without hover.

**Motion.** Let the immersive introduction reveal interest points as people scroll and explanations when they select a point. Preserve ordinary scrolling, keyboard access and a complete reduced-motion experience. Label staged or fictional scenes clearly. Keep the relationship between selection and explanation understandable without animation.


Use the implemented 8px base component radius and quiet borders. Keep larger compositions open instead of wrapping every fragment in a card. Build on the 8px spacing rhythm with 4px for compact gaps. Platform-specific iPhone prototype requirements remain governed by the PRD.

### Guardrails and product truth

**Never** fabricate place identities, facts, citations, photos, testimonials or coverage claims. Never use generated or unrelated imagery as documentary evidence of an actual place. Never imply that suggestions form a route, timetable or ranking. Never silently replace Glacier + Oxblood, introduce undocumented brand colors or treat legacy Teal Mist as the approved direction.

**Never** present planned functionality as available. The landing-page example is a prepared demonstration. Verify current implementation and PRD status before describing live maps or AI answers as available. Native iOS, accounts and device sync come later. Global selection does not guarantee complete answers. Browser-local history does not mean requests are processed entirely on the device.

**Avoid** luxury-travel styling that makes ordinary streets feel out of scope, generic AI graphics, decorative feature-card grids, competing bright map colors and excessive badges. Avoid overusing “little,” “magical” or “story.” Keep uncertainty and source limitations visible.

**Prefer** typography and spacing for hierarchy, one strong visual subject, real neighborhood context and concise sourced answers. Preserve the user's agency to choose places and follow questions. Ask about material conflicts instead of inventing approval.


### Tokens and canonical references

The authoritative [token source](../landing-page/src/design-system/tokens.json) contains primitive values and semantic roles for light and dark modes. [theme.css](../landing-page/src/theme.css) imports the generated CSS. Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for token usage, state pairings and generation commands. Use implemented spacing, type, radius, size, shadow and motion roles. Component tokens remain deferred until stable contracts are needed; compatibility aliases are not new brand vocabulary.

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
