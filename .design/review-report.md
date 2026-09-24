# Menu architecture review

## Scope and evidence

Proposal only, based on the user's annotated 1079×837 screenshot of #mockup, the three agreed exploration flows, and static inspection of landing-page/src/studio/Mockup.tsx. No product files changed and no new browser interaction was run in this turn. The previous implementation turn verified the drawer and active-walk path; this review does not claim a new accessibility or responsive audit.

The menu should support starting a walk and returning to an exploration. Keep the map as home and keep planning connected to the conversation that produced the walk.

## Preserve

The map remains the main surface, with compact chat and a secondary drawer. Preserve the restrained two-purpose menu instead of introducing separate modes, folders or a second navigation system.

## Applicable scorecard

| Dimension | Score | Rationale |
|---|---|---|
| Hierarchy | 3 / 4 | Clear, short drawer; existing labels provide little context for returning to saved work. |
| Task affordance | 2 / 4 | Plan has different destinations depending on prior state. |

## Finding

| ID | Severity | Area | Location / evidence | Current behavior | Proposed correction | User impact |
|---|---|---|---|---|---|---|
| MENU-01 | MEDIUM | Action meaning | landing-page/src/studio/Mockup.tsx:283 | Plan opens the active walk, existing route, or new planner depending on state. | Separate a conditional Resume walk action from an always-consistent Plan a walk action. | Makes the destination explicit and keeps starting a new plan discoverable. |

## Proposed hierarchy

A conditional Resume walk row appears first when a walk is active. Plan a walk follows and always begins a fresh planning conversation. Recent conversations shows up to three useful titles directly, followed by View all. Settings can sit at the bottom when settings are implemented; do not add a dead entry now.

A recent conversation may contain map questions, photo questions and a planned walk. Opening it should restore its chat, place context and any route or walking progress. This is proposed behavior: current conversations are keyed by subject and the route/walk are separate singleton state, so unified restoration requires a later state-model change.

## Priority and alternatives

Now: agree the hierarchy and action names. Next, if authorized: implement MENU-01 and the short recent list, including empty and long-title states. Later: consider collections only when users have enough saved work to need them.

Rejected a Plan folder because creating a walk is an action and its result belongs with the associated conversation. Rejected a full history browser inside the narrow drawer because a short preview plus View all keeps the map easy to return to.

## Verification gaps and verdict

No evidence yet about frequency of repeat visits, saved-walk reuse, or the ideal number of recent rows. Three is a proposed starting point. Walk draft preservation and independent conversation/route restoration need implementation design before coding.

Scoped verdict: Needs changes to the Plan action's naming and destination consistency. The rest is a proposed direction, not an approved implementation or tested user preference.


## Implemented after user approval, 2026-09-15

MENU-01 is resolved. The drawer now has a conditional Resume walk action, a separate Plan a walk action, three recent conversation previews with Chat/Walk labels, and View all. Walk items open route details; Chat items reopen their conversation. A contextual Plan a walk action can add the first route to an existing Chat while retaining its earlier questions. Conversation and View walk controls connect the two views. No settings or folder navigation was added.

Data moved to a validated v4 conversation model with non-destructive import of v3 chats, draft inputs and routes/walking progress. Each item owns its route and walk. Resume prioritizes an active walk, falls back to a paused one, and resumes with one tap. Starting a different walk pauses the old one without replacing its saved progress.

Verification: 11 node state tests, TypeScript, Studio build and generated artifact/token checks pass. In the isolated localhost preview, exercised empty and mixed history, Chat reopening, Chat-to-Walk transition with its original question preserved, planning cancellation, independent 45/60-minute routes, older walk resuming at stop 2/3 after a second walk starts, history persistence after reload, the three-row cap versus four entries in View all, keyboard focus wrapping, and light/dark rendering. At 320px, page and scroll widths were both 305px; history rows fit and measured 68–83px tall. No browser warning/error logs occurred. User study was not reset or populated with test records. Screen-reader, RTL and native on-screen-keyboard checks were not performed.

Scoped verdict: Approved for the implemented menu flow, based on these checks. This does not certify the whole app or its accessibility.
