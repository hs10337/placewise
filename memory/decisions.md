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
