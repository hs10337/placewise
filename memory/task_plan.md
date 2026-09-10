# Task Plan

## Goal

Deliver a completed prototype and landing page. The product definition, acceptance criteria, data contract, and delivery destinations remain open.

## Protocol 0: Initialization

- [x] Initialize `memory/task_plan.md`, `findings.md`, `progress.md`, and `decisions.md`.
- [x] Initialize `CLAUDE.md` with schema status, behavioral rules, architectural invariants, and phase outputs.
- [x] Block execution logic until discovery, schemas, payload confirmation, and Blueprint approval are complete.

## B: Blueprint

- [x] Ask North Star and record the user's answer.
- [x] Capture the integrations answer: "tbd". Services and credential readiness remain unresolved.
- [x] Capture the source-of-truth answer: "tbd". Primary content and data location remain unresolved.
- [ ] Capture the exact delivery payload and destinations. This question is pending.
- [ ] Ask and capture behavioral rules after the delivery answer.
- [ ] Resolve required integrations, credential readiness, the source of truth, and remaining product requirements; define measurable completion criteria.
- [ ] Research relevant repositories, documentation, and prior art; log sources and findings.
- [ ] Define input and output JSON schemas in `CLAUDE.md`.
- [ ] Obtain user confirmation of the payload shape.
- [ ] Present a concrete Blueprint and obtain explicit approval.

### Blueprint approval

Status: NOT APPROVED.

Approved scope: none yet. Approval evidence: none. Execution logic remains blocked.

## L: Link

- [ ] Verify each required API connection and credential without exposing secrets.
- [ ] Create minimal probe scripts only after the Blueprint gate opens.
- [ ] Record each result in `memory/progress.md`; halt on broken links.

## A: Architect

- [ ] Write technical SOPs before implementation.
- [ ] Define navigation and routing according to the approved Blueprint.
- [ ] Implement atomic, deterministic tools and relevant verification.
- [ ] Keep intermediate files in `.tmp/` and credentials outside version control.

## S: Stylize

- [ ] Refine the prototype and landing page against confirmed acceptance criteria.
- [ ] Attach verification evidence to every output.
- [ ] Present the concrete result and obtain sign-off before deployment.

## T: Trigger

- [ ] Deliver the approved payload to its final destination.
- [ ] Configure the approved firing mechanism and document it in `CLAUDE.md`.
- [ ] Verify production delivery and finalize maintenance procedures.
- [ ] Confirm the North Star is satisfied using the agreed acceptance criteria.

## Current next action

Wait for the delivery-payload answer. Continue the remaining discovery question afterward. An answer of "tbd" records an open decision and does not satisfy the execution gate. No execution logic is authorized.
