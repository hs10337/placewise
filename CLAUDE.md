# Project Constitution

## Current state

Initialization is complete. Phase B discovery is in progress. The Blueprint is not approved, and execution logic is blocked.

The North Star is a completed prototype and landing page. The product, prototype behavior, landing page content, and acceptance criteria still need definition. Previous repository contents do not establish requirements for this fresh start.

Paths in this constitution are relative to the project root. `memory/` is project memory, not a system-level directory.

## Discovery register

| Topic | Answer | State |
| --- | --- | --- |
| North Star | User: "prototype is done, landing page is done" | Captured; completion criteria pending |
| Integrations | User: "tbd"; services and credential readiness remain undecided | Captured; unresolved |
| Source of Truth | User: "tbd"; primary content and data location remain undecided | Captured; unresolved |
| Delivery Payload | Prototype and landing page named; exact outputs and destinations unknown | Asked; awaiting answer |
| Behavioral Rules | Project-specific rules not specified | Not yet asked |

Ask the five discovery questions one at a time and wait for each answer. Never assume an unanswered business requirement. Record answers in `memory/findings.md` and keep this register current.

## Data schemas

### Input JSON schema

Pending discovery. No input schema is defined or approved. Establish the primary data, required fields, types, validation constraints, and failure conditions before proposing the schema.

### Output JSON schema

Pending discovery. No output schema or payload shape is defined or confirmed. Establish the deliverables, delivery destinations, required fields, and success and failure representations before proposing the schema.

### Execution gate

No logic or probe scripts may be written in `execution/` until all five discovery questions are answered, the input and output JSON schemas are defined here, the payload shape is confirmed by the user, and the Blueprint in `memory/task_plan.md` has explicit user approval. A proposal or an unanswered question does not count as approval.

After that gate opens, Phase L may create minimal connection probes. Business logic remains blocked until every required link is verified. If discovery identifies no external services, record that explicitly instead of inventing integrations.

## Behavioral rules

Reliability takes priority over speed. Business logic must be deterministic; do not guess business rules or fabricate data, service access, test results, or delivery success.

Use direct, concise language. Avoid hype, corporate phrasing, filler, and em dashes. Additional product behavior, must-dos, must-not-dos, and refusal triggers await discovery.

Make surgical changes and choose the simplest solution that serves the North Star. Follow explore, plan, implement, and commit for each authorized task while respecting the execution gate.

Every delivered output must include a relevant test, screenshot, or one-line verification command. Do not ship an output that cannot be verified. Present the refined result for user sign-off before deployment.

Credentials belong in `.env` or the platform equivalent. Never place secret values in version control, memory, SOPs, or diagnostic output. Credential readiness can be discussed without asking the user to paste secrets into chat.

## Architectural invariants

| Layer | Location | Responsibility |
| --- | --- | --- |
| Architecture | `architecture/` | Markdown SOPs defining goals, inputs, tool logic, and edge cases |
| Navigation | Decision-making layer; implementation pending | Reasoning and routing between SOPs and tools; delegates complex work |
| Tools | `execution/` | Atomic, deterministic, testable scripts implementing approved logic |

Update the relevant SOP before changing its implementation. When repairing a failure, inspect the error first, document the intended behavior change in the SOP, patch the script, test the fix, then record the verified lesson in the SOP and memory. This preserves both the SOP-first rule and the repair loop.

Route intermediate file operations through `.tmp/`. Final deliverables belong at the destination confirmed during discovery. Do not create speculative abstractions or choose a runtime, framework, service, or deployment target before the requirements justify it.

## B.L.A.S.T. phase outputs

| Phase | Required output | Current state |
| --- | --- | --- |
| B: Blueprint | Five discovery answers, confirmed input/output schemas, relevant research, and an approved plan | Discovery in progress; not approved |
| L: Link | Verified required API connections and credentials, minimal probe scripts, and documented results | Blocked by Blueprint gate |
| A: Architect | SOPs, navigation flow, deterministic tools, and relevant verification | Blocked by Link verification |
| S: Stylize | Delivery-ready payload and UI where applicable, verification evidence, and user sign-off | Pending implementation |
| T: Trigger | Production delivery, documented firing mechanism, and maintenance procedures | Pending sign-off |

## Trigger register

No trigger or production destination has been selected. Record each approved trigger's mechanism, entry point, schedule or event, configuration requirements, and verification evidence before activation. Do not create an automation during initialization.

## Long-term stability

No runtime exists yet. During implementation, define service-specific failure detection, safe recovery, observability, and operational ownership according to the approved requirements.

For each failure, retain the error evidence, the tested repair, and the corresponding SOP lesson. Log work, errors, tests, and results in `memory/progress.md`; record architectural choices and reasons in `memory/decisions.md`.

The project is complete only when the confirmed payload reaches its agreed final destination and the acceptance criteria are verified. A local draft or passing connection probe alone is not completion.
