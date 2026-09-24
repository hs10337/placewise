# Street panoramas: Bank junction and Times Square

The current `preview.html` opens at Bank junction in London, with New York and London buttons to switch locations. `photo-viewer.html` is the editable source; copy it to `preview.html` after changes. Direct location links use `#bank-junction` and `#times-square`.

Bank junction uses the official Google Maps share embed for panorama `ELvZHefNxddktL4ExindnQ`, an outdoor view beside Bank station at the junction, captured in December 2023. Google attribution and controls remain visible. The footer date describes the initial panorama; navigating inside Street View may show other captures. Verified that the embed loads, and that both location buttons update the heading, frame, attribution, date, and direct link correctly.

## Times Square photo tour

The New York option embeds a real daytime and nighttime panoramic photo tour by Miguel Ángel Victoria / Mi México 360. The publisher explicitly permits embedding under CC BY 4.0 with credit, which is retained both around the frame and inside the original viewer. The source article was published May 3, 2019; the exact capture date is not established. This is archival photography, not a live feed.

Open `http://127.0.0.1:8765/preview.html#times-square` while the local server is running. Press “COMENZAR” to enter, drag to look around, and use the two thumbnails at the top to switch between night and day. The external tour must remain reachable. The footer also links directly to the tour.

Verified the embedded photo tour loads and responds to drag rotation in the Codex browser. [Source and reuse permission](https://www.mimexico360.com/times-square-nueva-york/), [full tour](https://360.sinaloa360.com/times-square/), and [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).

## Earlier illustrative model

An illustrative, rotatable Three.js model of Times Square. The preview supports orbiting, zooming, a street-level camera at Duffy Square, optional automatic rotation, mouse/touch input, keyboard controls, and reduced motion. Geometry is simplified and the billboard artwork is original, rather than a record of current advertising.

Run `python3 build.py` in this directory, then serve it with `python3 -m http.server 8765 --bind 127.0.0.1` and open `http://127.0.0.1:8765/model.html`. This rebuilds only the earlier model and leaves the photo preview intact. The browser loads Three.js 0.160.1 from esm.sh; other scene assets are generated locally with canvas. `viewer.html`, `scene.js`, and `billboards.js` are the editable model sources. `index.html` is the conversation-style QA wrapper for that model.

Layout and landmark placement follow the [NYC Planning 1568 Broadway assessment](https://www.nyc.gov/assets/planning/download/pdf/applicants/env-review/eas/18dcp100m-eas.pdf), [PBDW’s TSX Broadway project](https://www.pbdw.com/tsx-broadway), and [Jamestown’s One Times Square description](https://www.jamestownlp.com/news/one-times-square-launches-limited-time-preview-experiences-offering-up-close-access-to-the-times-square-new-years-eve-ball).

Verified in the Codex browser at desktop, 736px, and 360px widths. Confirmed WebGL rendering without console errors, drag rotation in the standalone preview, rotation buttons, street-level switching, and responsive controls. The embedded QA wrapper’s automated coordinate drag does not reach its nested iframe; direct-preview drag changes the camera correctly.
