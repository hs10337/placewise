# iOS component reference audit

Implemented September 20, 2026 against the [user-supplied iOS 18 and iPadOS 18 kit](https://www.figma.com/design/NIrQjae7K6P1bWltTznAaN/iOS-18-and-iPadOS-18--Community-?node-id=221-56229). This readable design file supersedes the earlier iOS 26 Community link for the current component pass. The Figma file was inspected and exported read-only; no components were imported into or added to a Figma canvas.

## Reference mapping

| Component | Verified source node | Implementation |
| --- | --- | --- |
| Keyboard | `106:59544` | Original Shift, Delete, emoji and microphone exports. 42px visible keycaps with 4.6px corners; 44px interaction targets and 54px row pitch. 6px horizontal gaps, centered second/third rows, and approximately 24% / 50% / 24% bottom-row proportions. 55px accessory area contains emoji, hide and dictation actions. |
| Status bar | `523:41288` | Original cellular, Wi-Fi and battery exports, 7px gaps, 124px center spacer and balanced side columns. 54px navigation-safe height and 21px top inset follow the navigation composition. Keep the user-approved 13px bold time. Smaller phone previews adapt the spacer to avoid collisions. System chrome sits above the sidebar instead of being partially covered by its panel. |
| Home indicator | `106:60044` | 144×5px bar, 26px bottom region and 8px bottom clearance. Keyboard background extends through the bottom region. |
| Large filled buttons | `5:108579` | 50px minimum height, 12px corners and 20px horizontal padding, preserving Placewise type and colors. Compact toolbar/composer controls keep 44px targets. |
| iPhone menus | `492:52296` | 250px panels, 12px corners, minimum 44px rows, 16px insets, trailing icons and full-width hairline separators. Camera / Photo / File remains above +. Route menus use the same pattern. |
| Navigation bar | `1:54520` | 54px top safe region, 44px toolbar minimum, centered title using regular Ionic title geometry. Preserve existing heading typography. |
| Lists | `550:50627` and `550:50515` | Regular rows have 44px minimum height and 16px insets; history rows with secondary text have 60px minimum height. Inset half-pixel separators and trailing controls remain accessible. |
| Text-field rows | `553:23061` | Fixed inline labels and 44px minimum rows for subject, location and neighborhood controls. Composer remains its approved app-specific arrangement. |
| Toggle | `27:68905` | 51×31px track, 27px handle and 2px handle spacing using Ionic’s existing behavior and Placewise color roles. |

## Deliberate adaptations

Placewise typography and palette remain unchanged. The browser keeps Ionic’s event handling, focus behavior and control semantics. Default app Ionicons remain where the kit supplies editable symbol placeholders rather than a matching action glyph. The menu sidebar is an existing Placewise flow, not a new iPad sidebar. Mapbox, the location context and compact composer remain app-specific.

The desktop keyboard is interactive preview UI, not a native keyboard. It omits the predictive-text strip because the prototype has no prediction service. Emoji uses a compact sample set. Touch devices continue to use the OS keyboard. Autocomplete and a full OS emoji catalog are not simulated. Keycaps retain 44px interaction targets while their visible geometry matches the kit’s 42px keys. Emoji deletion respects surrogate pairs, and insertion refuses a key that would exceed the message limit rather than splitting it.

## Validation

The standalone build and TypeScript check pass. Browser checks cover letters and automatic shift reset, numbers, emoji insertion/deletion, keyboard send with neighborhood context, outside dismissal, reopening, 54px one/two-line composer and 76px third-line growth, attachment menu positioning, radio navigation and switch dimensions. Light and dark appearances were inspected, including a 320px viewport with no horizontal overflow. Final title alignment is checked after removing Ionic’s small-title layout, which had shifted the heading off center.
