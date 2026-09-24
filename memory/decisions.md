# Decisions

## D001: Project-relative paths

Date: 2026-09-10. Status: initialization convention.

Treat `/memory/`, `/architecture/`, `/execution/`, and `/.tmp/` in the protocol as directories beneath the project root. The supplied default tree places them beside `CLAUDE.md`; system-level directories would not represent this project layout.

## D002: Keep unknown requirements explicit

Date: 2026-09-10. Status: required by protocol.

Capture a completed prototype and landing page as the North Star without inventing their behavior, content, stack, or delivery destination. Leave schemas undefined and the Blueprint unapproved until discovery and confirmation supply the missing requirements.

## D003: Reconcile SOP-first changes with the repair loop

Date: 2026-09-10. Status: protocol interpretation.

After inspecting a failure, update the SOP with the intended behavior change before patching code. After testing, add the verified lesson to that SOP. This satisfies the requirement to update architecture before logic changes while also retaining the repair loop's final documentation step.

## D004: Keep initialization limited to project memory

Date: 2026-09-10. Status: current scope.

Initialize only `CLAUDE.md` and the four requested memory documents. Defer execution scripts, connection probes, runtime choices, triggers, and production changes until their protocol gates are satisfied. Do not carry forward product assumptions from the deleted implementation.

## D005: iOS component visual reference

Date: 2026-09-20. Status: user-approved.

Use the [user-supplied iOS UI Figma file](https://www.figma.com/community/file/1527721578857867021) when implementing or revising iOS elements. Inspect the relevant components and states first, and use their geometry, spacing, sizing and layout. Keep Placewise typography and colors and existing approved interactions. The browser prototype remains Ionic React in iOS mode; this reference does not authorize migration to native code or an automatic redesign. See `docs/product.md` and `docs/DESIGN_SYSTEM.md`.

## D006: Use the accessible iOS 18 kit for the component update

Date: 2026-09-20. Status: user-supplied reference.

The user provided the readable design file `NIrQjae7K6P1bWltTznAaN`, cover node `221:56229`, after the iOS 26 Community listing did not expose usable component context. This iOS 18 / iPadOS 18 file is the active implementation reference, superseding D005’s iOS 26 link for this pass. Read its actual component nodes and export original icons without mutating Figma. Retain Placewise colors and typography and the approved chat interactions. Measurements, source nodes, adaptations and validation are recorded in `docs/ios-component-audit.md`.

## D007: Establish the new mockup foundation before product flows

September 24: The user explicitly invoked `ios-web-foundation` before starting a new mockup. Target iOS 18, reuse the Placewise theme and compatible installed primitives, and create a separate foundation preview entry in the existing Vite project. Keep the previous mockup and its saved data intact. No product journey is selected or implemented in this pass. Inspect Figma components individually because the supplied starting node is the Activity views canvas. The new iPhone foundation uses system typography, shared brand colors, explicit safe-area ownership, and a separable decorative frame.
