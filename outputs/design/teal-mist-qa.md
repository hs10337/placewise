# Teal Mist landing page review

September 14, 2026. Implementation is in `landing-page/`. Local review URL: http://127.0.0.1:5174/.

## Direction

Used [Teal Mist by Serafim](https://21st.dev/@serafimcloud/themes/teal-mist) for the palette, Georgia/Inter typography and component geometry, with `landing_page_principles.md` and the current PRD governing composition and claims. Primary action labels use dark teal for contrast against the bright source-theme primary. The page connects a verified photograph, illustrated map and source-backed answer.

## Verified

Production TypeScript and Vite build pass. Browser inspection at 320, 390, 768, 1024 and 1440 pixels found no horizontal page overflow. Visually reviewed the desktop hero, explorer and sources section, and the phone hero and conversation. Both documentary image instances load. Internal links resolve to existing IDs, IDs are unique, and no browser warnings or errors were reported during the final runtime check.

Verified hero map selection, editable suggested questions, sourced answers, separate place context, explicit preference application, kept and manually added places surviving preference updates, remove/add actions, the empty group state and recovery through map selection. Verified saved drafts across a reload and the explanatory fallback for unsupported questions. The reset action clears the demo state.

Verified keyboard activation of map markers and FAQ disclosures. The mobile navigation closes on Escape and restores focus to its trigger. Collapsing and reopening a conversation preserves its draft. Widening to desktop reopens a collapsed mobile conversation. Reduced-motion CSS removes entrance, reveal, hover and accordion animation.

## Scope

This is an interactive landing-page demonstration with three real places and prepared answers. It does not connect a global map engine, arbitrary AI questions, geolocation, accounts or sync. No public deployment was created. Slow-network emulation, an OS-level reduced-motion toggle and a screen-reader session were not performed. This review is not a full accessibility certification.
