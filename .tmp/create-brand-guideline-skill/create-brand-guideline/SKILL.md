---
name: create-brand-guideline
description: "Create or refine concise brand guidelines for AI and coding agents from product context and existing brand decisions. Use for drafting brand guidance or turning an agreed direction into reusable voice, visual, UI, and token rules. Do not use for routine UI implementation or isolated copy or token edits."
---

# Create Brand Guideline

Create a compact instruction system that helps agents make consistent design, writing and implementation decisions. Prioritize actionable rules, explicit preferences and structured design tokens over brand-book storytelling.

Every sentence should change what an agent does, prefers, avoids or chooses when the answer is ambiguous. Remove sections or explanations that do not improve those decisions. Aim for 800–1,500 words for a new guideline, shorter for a simple brand. Do not expand a focused update to meet a word count.

## Inspect context before asking

Read relevant conversation context and user-provided references. In a repository, inspect the PRD or product brief, existing brand documents, project instructions, theme files, CSS variables, Tailwind configuration, font imports, logo assets, representative components and product or marketing copy. Search likely locations such as docs, design, styles, tokens, theme, assets, public, components, app and src. Inspect relevant images when their appearance affects the guidance.

Treat implementation as evidence of the current state, not automatic proof of approved brand intent. Distinguish user-confirmed decisions, implemented choices and earlier experiments. Preserve clear existing decisions; ask about material conflicts instead of silently choosing a new direction. Keep product claims aligned with actual scope and availability.

Determine what is known about the product name, purpose, primary audience, desired emotional character, existing visual direction, colors, typography, references and styles to avoid. Do not turn preferences from another project or illustrative examples into defaults for this brand.

## Ask questions when anything important is unclear

Ask any necessary clarifying questions when missing information, ambiguous preferences or conflicting evidence would materially change the guideline. Ask the smallest useful set, after checking available context. Do not re-ask questions already answered or conduct a long brand workshop unless requested.

Useful questions clarify what people should feel, which visual choices must be preserved, what references capture the intended direction, which styles should be avoided, or which conflicting direction the user prefers. Make questions specific to the unresolved decision instead of presenting a generic questionnaire.

Continue drafting unaffected sections while waiting for answers. Keep unresolved choices explicit. Label optional recommendations and provisional token values as proposals; do not present them as approved decisions. If the context is sufficient, proceed without inventing questions.

## Synthesize into observable rules

Translate abstract attributes into design and writing choices. Explain the tradeoffs that guide a decision. For example, an agreed preference for warmth might become natural imagery, comfortable reading space and conversational language. Those are possible interpretations, not universal prescriptions for a warm brand.

Use concise rules and meaningful examples. Preserve the user's tone and formatting preferences. Favor a small number of distinctive constraints over generic adjectives such as modern, beautiful or innovative.

Write for an agent that needs to decide: use imperative language such as Use, Prefer, Avoid, Never, Default to, and When X, do Y. Make important constraints easy to retrieve. Use explicit contrasts when they clarify a choice and fit the user's requested style. Omit brand storytelling, marketing language, historical background, repeated ideas and philosophy that does not affect execution.

Do not add traditional brand-book material by default: long mission statements, persona decks, archetype exercises, logo construction grids, exhaustive clear-space rules, color theory, large typography catalogs, mood-board commentary, marketing strategy, competitive positioning or audience research summaries. Include such material when it changes implementation decisions or the user explicitly requests it.

## Guideline structure

Use these seven sections unless the user specifies another structure or a section is irrelevant. Keep unresolved decisions within the affected section rather than adding speculative content to fill the outline.

### 1. Brand Core

In 3–5 sentences, explain what the product is, who it serves, the role it plays in their life and the emotional impression it should create. Make this practical enough to guide copy and design. Avoid mission-statement language and unsupported product promises.

### 2. Brand Principles

Define 3–5 principles that resolve real design or communication tradeoffs. Give each principle 1–3 concrete implications when useful. Explain what to prioritize and what would undermine the intended character. Use concrete names and choices instead of a list of virtues. Use contrast only when it clarifies the decision and fits the user's writing preferences.

### 3. Voice & Tone

Specify sentence and paragraph style, capitalization, punctuation, contractions, terminology, headline style and CTA language where these matter. Explain how tone changes between an invitation, practical information, uncertainty and errors.

Include 2–4 short examples when they clarify meaningful differences. A prefer/avoid table can help when compatible with the requested format. Demonstrate how the voice works rather than repeating personality adjectives. Follow known product capabilities when writing sample promises or actions.

### 4. Visual Language

Describe relevant composition, typography, color, shape, imagery and motion choices as implementation guidance. Cover alignment, spacing, density and hierarchy; the roles of display and interface typography; accent frequency; container and corner treatment; photography, illustration and icon behavior. Include motion only when it serves the experience.

State what the agent should actually do, such as giving a composition one dominant subject or reserving the strongest accent for selection. Avoid vague instructions such as clean and modern. Use the brand's established visual direction rather than prescribing an editorial, minimal or technology aesthetic to every project.

Where relevant, describe UI character through forms, action hierarchy, selected states, feedback and errors. Retain established primitives and product behavior, with accessible labels and visible interaction states. Do not prescribe a new framework or invent workflows as a side effect of documenting the brand.

### 5. Design Tokens

Put tokens in a fenced CSS, JSON or YAML block matching the project's conventions. Do not bury values in prose. If the project uses CSS variables, include their actual names. Preserve existing token names, units, aliases and semantic roles. Cover relevant colors, typography, spacing, layout and radii without inventing categories solely for completeness.

Identify the source file and whether values are established, currently implemented or proposed. Separate proposed values from established ones so agents cannot mistake a suggestion for a production token. Use actual available values. If an exact value is undecided, label it clearly as TBD. Keep TBD entries separate from executable CSS, or use a valid draft data format with an explicit TBD status. Do not fabricate precision.

Do not copy sample hex colors, fonts or measurements as defaults. Avoid creating a competing token system when one exists. Include usable foreground/background pairings when known, and identify contrast checks still needed. Do not claim accessibility has been verified from a palette alone.

### 6. Guardrails & Anti-Patterns

Make this section explicit and easy to retrieve. Tell future agents what they should not do and how strongly each constraint applies. Use **Never** for hard brand violations, **Avoid** for choices that are usually wrong but may fit a rare circumstance, and **Prefer** for defaults when several valid options exist. Do not turn a preference into a prohibition.

Derive guardrails from this brand's decisions and likely points of drift. Depending on the brand, these may concern imagery, token changes, gradients, container shapes, decorative effects or competing visual ideas. Examples are prompts for judgment, not a universal ban list. Do not populate this section with generic design advice.

### 7. Canonical References

Identify the strongest established examples of the brand: screens, components, pages, images, illustrations, advertisements or copy. Supply repository paths for local references and usable links for external ones. For every reference, explain exactly what an agent should learn from it, such as overall composition, typography, border and radius behavior, photographic treatment or voice.

Distinguish approved canonical work from implementation examples, exploratory drafts and outside inspiration. Verify references before describing them. Do not promote an example to canonical status without supporting evidence. If no canonical references exist, say so; do not invent them.

At the end of the guideline, include an agent decision hierarchy when useful. Within the task's requirements, use this order: explicit instructions from the current user; existing approved canonical references; existing design tokens; brand guardrails; brand principles; existing product patterns; generic design conventions. When a generic convention conflicts with the brand guideline, follow the guideline. Surface material contradictions that this order cannot resolve instead of silently changing an agreed decision.

## Refine existing guidelines

Preserve deliberate decisions and existing token names wherever possible. Remove duplicated instructions, translate vague statements into executable rules, reconcile contradictions and add missing brand-specific guardrails where agents could drift. Keep the revised document shorter or equal in length unless important information was missing. Do not rewrite everything solely for stylistic consistency or force an existing document into the default outline for a narrow update.

## Deliver and check

Use the user's requested format and destination. When writing in a repository, update the existing brand guideline if appropriate; otherwise place a clearly named Markdown draft with the project documentation. Link to existing token sources. Drafting a guideline does not authorize changing application code, assets or theme configuration.

Before delivery, check that guidance is actionable, proposals are labeled, product claims match the source material, referenced files exist and token blocks are syntactically valid. Check for contradictions between visual rules, tokens and UI character. Remove duplicated rules and invented values. Summarize the resulting direction and any material decisions still open without requiring approval of choices the user already made.
