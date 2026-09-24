# Design directions verification

September 12, 2026. Checked `directions.html` in the Codex in-app browser through the local preview at `http://127.0.0.1:8766/directions.html`.

All three directions rendered at 1280px and 375px widths without horizontal document overflow. The remote photograph loaded at its 960px intrinsic width. Inspected all three desktop compositions and all three phone compositions. Revised the phone layouts to put the first answer before the large map, strengthened cinematic navigation contrast, and adjusted map labels to face the reader in the spatial study.

Verified both place selections, Telegraph Hill and Coit Tower follow-up answers, and return to the first question. Verified keyboard ArrowRight and Home switching between concept tabs. The example CTA moved focus to the answer. No browser error-level console entries were reported in the final check.

JavaScript syntax passed `node --check .tmp/design-directions-check.js`; the HTML has no duplicate IDs. Reduced-motion CSS and the JavaScript motion guard were reviewed in source. Reduced-motion emulation, screen-reader testing and a full WCAG audit were not performed.

The browser URL policy blocked a direct `file:` portability check. No workaround was attempted. Continue using the already permitted localhost preview, which serves only this design-output directory. The local server was left running for review; no public deployment was created.

These are visual studies with curated sourced answers and schematic geography. Live maps, arbitrary questions, AI requests and complete scroll narratives are not implemented. The proposed build libraries are described in `directions.md`; the studies themselves use native HTML, CSS and JavaScript.

Reopen command: `python3 -m http.server 8766 --bind 127.0.0.1 --directory outputs/design` from the project root, if the existing preview server has stopped.
