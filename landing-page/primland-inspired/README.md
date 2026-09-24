# Placewise, Primland-inspired landing page

This is the photographic, editorial landing-page direction based on `../example-page.html` and the project’s landing-page principles. It is kept separate from the concurrently edited alternate design in the parent folder. The user confirmed that the product name remains Placewise.

Run `npm install`, then `npm run dev -- --port 5175` from this directory. The currently running preview is at [localhost:5175](http://127.0.0.1:5175/). Run `npm run build` for a TypeScript check and production files in `dist/`.

## Design

The visual thesis is a quiet, photographic sense of place: forest ink, warm paper, an editorial serif and one terracotta selection color. The full-width photograph borrows Primland’s immersive scale, while an immediately readable sourced answer makes Placewise’s purpose clear.

The content moves from a real place and question to two ways of exploring, an interactive neighborhood example, visible evidence, a short FAQ and a final invitation. Entrance timing, scroll reveals and selection/hover transitions establish hierarchy. Reduced-motion styles remove all animation, and scrolling stays native.

React, TypeScript and Vite provide the implementation. Tailwind is available, and shadcn-style Button and Accordion primitives use Radix for composition and accessible disclosure behavior. Shared primitives are in `src/components/ui`; data and helpers are in `src/lib`.

## Demonstration

The three-place Telegraph Hill example uses prepared answers. Visitors can select map pins, apply interests, keep or remove suggestions, restore places, ask suggested questions and revisit separate conversations. Removed places remain excluded when interests change. Kept places survive updates. A browser-local demo record preserves choices, drafts and conversations. Reset clears it. Unknown questions retain the draft and explain the prepared-answer limit.

No live map service, OpenAI backend, location permission, account system, waitlist or deployment is connected. This is a complete landing page with a guided demonstration, not the full phase-one product. The primary CTA opens that demonstration. The diagram is an original schematic map and does not support navigation.

## Sources and assets

Coit Tower and Filbert Steps content comes from [SF Recreation & Parks](https://sfrecpark.org/Facilities/Facility/Details/Coit-Tower-290). Telegraph Hill’s semaphore and park history comes from [Pioneer Park](https://sfrecpark.org/facilities/facility/details/Pioneer-Park-381). References are linked beside the prepared answers.

The photograph is Sasha / @sanfrancisco’s [Coit Tower From Above](https://commons.wikimedia.org/wiki/File:Coit_Tower_From_Above_(Unsplash).jpg), listed as CC0 on Wikimedia Commons. It is displayed remotely with attribution. Fraunces and DM Sans are loaded through Google Fonts with local font fallbacks. The layout and example remain usable if the photo cannot load.

The original downloaded reference and prior project research are preserved.
