# Verification, September 14, 2026

The production build passes with strict TypeScript checks through `npm run build`. The page was inspected in the Codex browser at desktop, tablet and phone widths, including 1440, 1280, 820, 390 and 320 pixels. The 320-pixel browser exposed a scrollbar-width issue, fixed by reducing the body’s minimum width. Document scroll width then matched its client width.

The hero photograph and fonts load successfully. The first desktop and 390-pixel phone view show the product promise, primary CTA, selected example place and a readable sourced answer. A failed higher-resolution photograph URL exposed the image fallback during development; the working Wikimedia thumbnail endpoint replaced it.

Browser interaction checks confirmed that the primary CTA reaches the example, starter questions fill an editable draft before sending, place selections retain separate conversations, kept places survive interest changes, removed places remain excluded, and choices survive reload. Removing all places leaves a recoverable empty state. Reset works on phones. Unsupported free-text questions show the demonstration limit instead of inventing an answer.

Keyboard checks confirmed the mobile menu opens, Escape closes it and restores focus to its trigger, and Enter expands the Radix FAQ. One main landmark contains primary page content, and the live answer region remains mounted. Reduced-motion rules were reviewed in CSS; this was not an OS-level reduced-motion session. Browser-storage failure is handled in code but was not simulated in the browser.

The final page is isolated in this folder because the “Awesome design” task was editing the parent landing page concurrently. The isolated version has its own local preview and browser-storage key. No production deployment was performed.
