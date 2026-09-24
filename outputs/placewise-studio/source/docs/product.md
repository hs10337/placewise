# Placewise PRD

Working draft for development. Based on the [previous PRD](https://app.notion.com/p/337851fc063f80af9261fcfefcfc9980) and the current product discussion. Confirmed scope is identified below; detailed behavior and technical defaults are proposed for review.

## TL;DR

- Placewise is a map-first iOS app for understanding places. All UI must be designed mobile-first for iPhone, including the web prototype. Users can discover a small group of places in an area or select any point and ask about it without knowing its name.

- The selected point resolves to a named landmark with a photo when available, a named business with a category icon, or coordinates when no reliable place match exists. Selecting a point must always work, even when identifying it does not.

- **Phase 1, the current focus:** a global web prototype with real maps and OpenAI answers. Placewise suggests a group of places based on optional exploration preferences; users can refine the group and ask about each place. Explorations and separate place conversations are saved locally. No account is required.

- **Global scope:** users can select any point on the map. Place identification, photos, and answer depth depend on available data; missing coverage uses honest fallbacks.

- **Later iOS app:** carry the validated interaction into a native app and add account-based sync for explorations, preferences, and place conversations. Accounts and sync remain confirmed product requirements but are deferred from phase 1.

- **Proposed defaults:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and MapKit JS for the prototype; a TypeScript backend with OpenAI that the later iOS client can reuse. English UI and answers initially.

## Problem

- **Planning feels like homework.** Choosing worthwhile stops, fitting them into a route, and finding food takes effort before travelers can enjoy the day.

- **Someone has to hold the plan together.** Recommendations, saved places, and routes are scattered across apps, leaving the traveler to connect and keep track of everything.

- **Getting answers breaks the moment.** Learning about a place means stopping to search and check results. Travelers either spend the moment on their phone or leave their questions unanswered.

## Opportunity

- **Make choosing places easier.** Help travelers understand what makes a place interesting and whether it is worth their time, without piecing together multiple searches.

- **Keep place information connected to the map.** Bring locations, research, and conversations together so travelers spend less effort switching apps and keeping track of what they have learned.

- **Make learning part of exploring.** Let travelers ask about a specific place and get clear, sourced answers, without starting a new search for every follow-up.

## Jobs to be done

### Functional

- When exploring a city or neighborhood, help me discover a manageable group of places that matches my interests and gives me a better understanding of the area.

- When deciding what to visit, help me understand a place and whether it interests me without researching across multiple apps.

- When returning to a place I researched, help me find what I learned and see where it is without piecing the information together again.

- When exploring, help me understand the place that catches my attention and ask follow-up questions without knowing its name or starting another search.

### Emotional

- Feel confident that the places I choose are worth my time.

- Feel organized and less overwhelmed by research, without having to remember every detail.

- Feel curious and connected to my surroundings, with more attention to enjoy the experience.

## Non-goals

- **Planning the entire day:** automatic itineraries, route generation, turn-by-turn navigation, bookings, or finding stops and food along a route.

- **Venue rankings and comparisons:** exhaustive “best of” lists, review aggregation, booking recommendations, or multi-place chat comparisons. Suggesting a small, preference-based group of places in a selected area is in scope; users choose what to explore.

- **Other interaction modes:** general chat unrelated to the selected area or place, voice interaction, audio guides, AR, or camera-based identification. Area discovery and preference refinement are supported; ongoing Q&A stays in separate place conversations.

- **Social features or advanced trip organization:** public feeds, comments, public place submissions, importing research from other apps, shared trip plans, or complex collection management. Locally saved explorations, editable place groups, and place conversations are in scope.

- **Guaranteed coverage or completeness:** equally detailed information everywhere, exhaustive historical research, guaranteed live business details, or an answer for every point. Global exploration is in scope.

- **Offline services:** generating answers or guaranteeing map availability without a connection. Previously saved conversation text remains readable.

- **Accounts and native delivery in phase 1:** sign-in, cloud conversation history, cross-device sync, and native iOS development are deferred to the later app.

- **Additional platforms:** Android, a dedicated iPad app, or a production web product. Phase 1 is a responsive web prototype.

- **Monetization and migration:** payments, subscriptions, or automatic transfer of prototype browser history into future iOS accounts.

## Target users

### Primary

- **Curious, independent travelers**, with two exploration modes that the same person may switch between:

  - **Area exploration:** Discover a cluster of places that helps them understand a city or neighborhood and decide what to explore.
  - **Ad hoc curiosity:** Look up a specific place that catches their attention and get answers, without planning a broader outing.

### Secondary

- **Local explorers** curious about places in their own city or neighborhood.
- **New residents** getting to know their surroundings.
- **Remote explorers** learning about places around the world without an immediate plan to visit.

### Non-target for MVP

- Travelers expecting ready-made itineraries, optimized routes, or guided tours.
- Users primarily looking for venue rankings or booking tools.
- Researchers who need exhaustive archival information.

## Product principles

- **Design for iPhone first.** Every screen, layout, and interaction starts with the mobile experience. Prioritize touch controls, readable text, reachable actions, safe areas, and the on-screen keyboard. Validate UI at phone sizes before adapting it for larger screens. Use Apple's component patterns while retaining Placewise typography and colors. The browser prototype uses Ionic React in iOS mode for all applicable app components, including navigation, menus, lists, popovers, forms and controls. Ionic is a third-party web library; retain its component behavior while applying Placewise typography and colors. Native delivery will use UIKit or SwiftUI components. Desktop adaptations are secondary. See [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/).

Use the [user-supplied iOS 18 and iPadOS 18 Figma file](https://www.figma.com/design/NIrQjae7K6P1bWltTznAaN/iOS-18-and-iPadOS-18--Community-?node-id=221-56229) as the primary visual reference whenever implementing or revising iOS elements, including system chrome, keyboards and app controls. Inspect the relevant component and its states before implementation. Preserve Placewise typography and colors; use the reference for component geometry, spacing, sizing and layout. Keep agreed Placewise interactions unless the user requests a change.

- **Start with the place.** Let the map carry the location context so people can ask naturally, even when they do not know a place's name.

- **Remove the busywork.** Keep research connected to places and preserve context. Each interaction should reduce the searching, switching, or remembering the user has to do.

- **Let curiosity lead.** Follow the user's interests and questions. Give people useful context to make their own choices about what is worth their time.

- **Personalize each exploration.** Adapt to the interests, needs, and available time the user shares. Make preferences easy to express, apply, and change as they explore.

- **Make trust visible.** Show sources and uncertainty clearly. Let the available evidence determine how specific an answer can be, and stay useful when details are missing.

- **Respect the user's attention.** Give a useful first answer quickly, with depth available when wanted. Support both a quick question on the street and deeper research before a trip.

## Core Features

- **Phase 1:** a global web prototype with real maps, real OpenAI answers, and local browser history. Accounts, cloud history, and native iOS development come later.
- **Area exploration:** choose an area, share optional preferences, discover a small group of places, and explore each through its own conversation.
- **Ad hoc curiosity:** select any place or point and ask about it immediately, with no exploration setup required.
- **Confirmed discovery behavior:** Placewise suggests the initial group of places and users refine it. A group is an unordered set of places, with no implied route, schedule, or guarantee that every stop fits into the available time.

### Functional requirements

#### 1. Choose an area or a place

- Search for a city, neighborhood, or named place, or browse the map directly. Distinguish similarly named results with their available region and country.
- Open without sign-in. Restore the last viewed area when available; otherwise show the world map. Request location permission only when the user selects “My location.”
- Offer “Explore this area” for the current map view. Show the selected area clearly and hold it fixed until the user explicitly changes it; panning alone must not regenerate suggestions.
- Let users select a map place or arbitrary point directly. Support desktop click, touch POI selection, long-press for a raw point, and an accessible “Select map center” action. Dragging must remain map navigation.
- Keep exploration global. Missing local data or denied location permission must not block manual selection and questions. Validate coordinates consistently, including across the antimeridian.

- **Acceptance:** Someone can explore a neighborhood overseas or ask about an unnamed point without signing in or sharing their current location.

#### 2. Adapt the exploration to personal preferences

- Make preferences optional and easy to find. Start with interests, available time, and a short free-text note for other needs. Skipping preferences must still produce a useful experience.
- Show the preferences currently in use. Let users edit, remove, or clear them without restarting their exploration; require an explicit apply action before starting new paid work.
- Apply preferences to why places are suggested, which facts receive emphasis, and the depth of answers. Available time can shape the size and detail of the exploration, but must not imply a calculated itinerary.
- Scope preferences to the current exploration. Places opened from its group inherit them. A new exploration starts with defaults; reusing earlier preferences is an explicit choice.
- Allow preferences for a standalone place question without requiring area setup. Opening a place outside an exploration uses its saved standalone preferences or defaults, with the active settings visible. When preferences change, use them for future answers and offer “Update places” for an existing group; keep earlier answers intact.
- Show practical needs as user requests, not verified place attributes. For example, a request for step-free access must not cause the app to label a place accessible without supporting evidence.

- **Acceptance:** A user changes their interest from architecture to local history. New answers reflect the change, and they can refresh suggestions without losing their existing research.

#### 3. Discover and refine a group of places

- On “Explore this area,” suggest up to five identifiable places within the selected area, using the current preferences. If the area is too broad for useful results, ask the user to zoom in or select a neighborhood.
- Show the group on the map and in a compact list. Each place needs a name, location, category, and a short explanation of why it is relevant. Support factual explanations with source links.
- Give a brief overview of what the group can help the user learn about the area. Explain the connection between places without presenting them as a ranked list or planned route.
- Let users keep or remove a suggestion, add a specific place from the map, or request an updated set. Preserve added and kept places; refresh only the remaining suggestions. Removed places stay excluded within that exploration unless the user adds them back. Never silently widen the area.
- Use verified provider or source-backed place identities and coordinates. Return fewer places when evidence is sparse. If none can be supported, explain the gap and keep direct map selection available.
- Selecting a group member opens its place context and conversation. Provide a clear return to the area and its group. Suggestions alone must not create empty chat histories.

- **Acceptance:** A user explores a neighborhood with an interest in architecture, understands why each suggested place belongs, removes one, and opens another to ask a question.

#### 4. Identify and understand the selected place

- Confirm selection immediately with a marker and a visible context card. Keep the original selected coordinates separate from any matched place's coordinates.
- Accept an explicit POI identity or reliable containing-place evidence. Treat nearby search results as candidates; proximity, popularity, and image availability must not determine identity on their own.
- For an ambiguous point, offer up to three plausible matches and “Use selected point.” Let users correct or clear the context. A failed lookup and a genuine no-match must have distinct messages and recovery paths.
- Render a landmark or named non-business place with its name and a verified photo when available; a business with its name and category icon; an unidentified point with coordinates. A missing photo uses a neutral icon and never blocks questions.
- Preserve local names and scripts, with available region and country context. The initial UI and answer language is English. Never use generated or unrelated photos to represent the real place.
- Keep the active place visible beside the composer. Changing the map view must not change the subject of a question. Late results from an older selection must never replace the current one.

- **Acceptance:** Selecting a cafe inside a historic station does not silently choose the station. If the exact place is uncertain, the user can still ask about the selected point.

#### 5. Ask questions and follow curiosity

- Enable free-form questions about a selected place or point. Offer optional starters such as “What's interesting here?”, “What's its story?”, and “What should I know before visiting?”
- Give a concise first answer, with detail driven by follow-ups and the current preferences. Help users evaluate a place against their interests while distinguishing factual information from a subjective judgment about fit.
- Maintain one conversation per place in the current browser. Reopening a known place restores that conversation. An area groups references to places; it does not merge their chats into one conversation.
- Keep each answer attached to the place and preference version used when its question was sent. Shared exploration preferences can inform different place chats; their transcripts and evidence must remain separate.
- Interpret “here,” “it,” and “this place” as the selected place. Opening a place from another exploration uses that exploration's preferences for new answers without rewriting older messages.
- Show progress while retrieving and answering, stream text when available, and allow stop and retry. Changing places stops the visible response and requests cancellation; late output stays isolated from the new place.
- Changing a place's identity after a question has been sent opens the corrected place's conversation. Preserve the original question and context instead of silently moving them.

- **Acceptance:** A user asks about a building, follows up with “Who designed it?”, and later reopens the conversation. A question about a nearby business cannot inherit that building's history as its own.

#### 6. Make answers and suggestions trustworthy

- Retrieve evidence for new factual claims and show source links near the claims they support. Prefer directly relevant place websites, public records, and credible local or cultural sources. Never fabricate citations.
- Check that evidence refers to the selected place. Clearly distinguish information about the exact site from information about its surrounding area, and acknowledge conflicting or missing evidence.
- When only coordinates are known, explain what can be established about the location without inventing a place identity or history. The same standard applies when explaining why a place belongs in a suggested group.
- For opening hours, prices, closures, and other changing details, retrieve current information and show when it was checked. Interpret local-time questions in the selected place's time zone when known.
- Preserve original answer dates and source links in history. Opening a source must not lose the current exploration. Display required map, source, and photo attribution.
- Treat retrieved text as evidence, never as instructions that can change the user's context or override product rules.

- **Acceptance:** If a building's earlier use cannot be verified, the answer says so. A description of its neighborhood is not presented as the building's history.

#### 7. Keep research easy to revisit

- Save successful area explorations locally with their area, preferences, and place group. Save a place conversation when the user sends its first question. Standalone questions require no manual collection or project setup.
- Preserve conversations, source links, drafts, original context, and preferences across browser reloads. Show recent explorations and place conversations with clear names and last activity.
- Reopening an exploration restores its area, preferences, and group. Reopening a place restores its map context and chat. A place may appear in multiple groups while retaining one conversation.
- For identified places, match history through stable provider- or source-qualified IDs. Link records from different sources only when they are verified as the same entity. Give unresolved points their own saved identities; proximity alone must not merge conversations.
- Make deletion clear: removing a place from a group changes only that group. Deleting an exploration removes its grouping and reusable preferences; existing conversations retain the context snapshots attached to earlier answers. Deleting a place conversation removes its messages everywhere it is referenced. Clearing all history removes both explorations and conversations.
- Prevent late responses from restoring deleted content. Explain that history stays in this browser and can be lost when browser data is cleared. Prototype history does not sync across devices.
- If storage is unavailable or full, retain the current session in memory and explain that it will not be saved. A reload during generation restores any saved partial text as interrupted, with an explicit retry.

- **Acceptance:** A user returns after a reload and resumes an area exploration. Removing a place from that group does not erase a conversation they also use elsewhere.

### Requirements across all features

- **Mobile-first UI:** design and validate the map, chat sheet, dialogs, and forms for iPhone first. Respect safe areas, touch targets, and the on-screen keyboard. Preserve selection, preferences, and drafts when the keyboard opens or the sheet closes. Larger-screen layouts adapt the validated mobile experience.
- **Accessible controls:** support keyboard navigation, screen readers, text zoom, visible hover/focus/disabled states, and generous touch targets. Point selection must have an alternative to long-press and pointer precision.
- **Clear recovery:** show loading, empty, incomplete, offline, failed, and limited states where relevant. Preserve the user's inputs and allow explicit retry; reconnecting must not automatically resend paid requests.
- **Predictable requests:** distinguish a question or discovery submission from its generation attempts. Duplicate delivery must not create another paid call. Retries retain their submitted context, and stale work cannot replace a newer selection or preference update.
- **Responsive feedback:** proposed targets are selection feedback within 150 ms, a resolved context or useful fallback within 3 seconds for 95% of the evaluation set, and first useful answer text within 5 seconds at the median. Show discovery progress immediately and give every request a finite deadline. Validate targets across regions and browsers.
- **Minimal data handling:** use location access only on request, keep secrets on the backend, and explain what place context, preferences, and questions are sent to OpenAI. Conversation history and preferences stay local in phase 1; routine diagnostics must not retain their full contents.
- **Bounded running costs:** enforce server-side session limits, retrieval and output limits, deduplication, and an overall spending ceiling for both discovery and chat. A browser reset must not bypass all cost controls. Preserve inputs when a limit is reached.

### Later iOS app, deferred from phase 1

- Carry the validated area and single-place experiences into SwiftUI and native MapKit, with native accessibility and foreground location behavior.
- Add Sign in with Apple and account-based sync for explorations, preferences, and place conversations. Allow map browsing before sign-in and preserve drafts through authentication failures.
- Make the server authoritative for account history, with ownership checks and one active generation per conversation across devices. Reuse the prototype's context and request contracts.
- Support sign-out, conversation and exploration deletion, and in-app account deletion. Clear local account data on sign-out and prevent late work from recreating deleted history.

## Tech stack

### Phase 1 web prototype

- **Frontend: React + TypeScript + Vite.**

  - A small single-page app fits the map-and-chat workflow. Use Vite for local development and the static production build. Server-side rendering is unnecessary for this prototype. [Vite documentation](https://vite.dev/guide/).
  - Keep feature components close to their use. Put reusable primitives in `components/ui` and shared helpers in `lib`; avoid abstractions created only for one-off use.

- **UI: Tailwind CSS + shadcn/ui, with Ionic React for the iPhone prototype.**

  - Keep shadcn/ui as the general foundation outside the phone app. The phone prototype uses `@ionic/react` 9.0.4 in iOS mode for navigation bars, the sidebar, buttons, lists, popovers, selects, radio choices, checkboxes, the Coffee toggle and text entry. Use `IonIcon` with Ionicons for app icons and `IonSpinner` for loading feedback. Shared button and popover adapters live in `components/ui`; preserve Ionic geometry and interaction states while applying Placewise's existing typography and colors. [Ionic React integration](https://ionicframework.com/docs/react/add-to-existing).
  - Build the iPhone map-and-chat experience first, with touch-friendly dialogs and forms, an 8px spacing rhythm and clear primary, secondary and ghost actions. Preserve the approved compact composer, third-line growth and conversation opening. Keep Ionic menus and popovers within the phone frame. Mapbox remains the study's map provider; browser file/photo pickers and the real mobile keyboard remain OS features. The desktop keyboard uses Ionic buttons within its simulated layout. Adapt for larger screens only after validating the mobile UI. [shadcn/ui with Vite](https://ui.shadcn.com/docs/installation/vite).

- **Map: Apple MapKit JS.**

  - Use MapKit JS for the real map, annotations, place lookup, and supported selection interactions. Use browser geolocation only for the optional “My location” action.
  - Validate raw-coordinate selection, POI identity lookup, and candidate coverage across regions early. An address lookup alone is not a business or landmark match.
  - Configure Apple Maps authorization for the prototype's actual domains and keep signing keys on the backend. Retain required map attribution. [MapKit JS documentation](https://developer.apple.com/documentation/mapkitjs).

- **Local history: IndexedDB.**

  - Store explorations, areas, preferences, group membership, conversations, drafts, immutable context records, permitted place references, answer text, and citations in the browser, with a versioned local schema.
  - Treat browser data as the history source of truth in phase 1. Use the session-only fallback described under “Keep research easy to revisit” when local storage fails. No Supabase conversation or exploration tables or user accounts are needed yet.

- **Prototype verification.**

  - Use focused unit checks for matching policy, place and preference context, stale responses, and retries; browser tests for area discovery, preference changes, group refinement, selection, follow-ups, local persistence, deletion, and keyboard flow.
  - Evaluate real answers against a fixed set of questions across countries, covering landmarks, businesses, ambiguous sites, unnamed points, and sparse evidence. A passing interface test does not establish factual correctness.

### Shared backend and data

- **Backend: Supabase Edge Functions in TypeScript.**

  - Handle area discovery, preference-based refinement, place answers, optional landmark enrichment, coordinate validation, request deduplication, cancellation, and usage controls in one backend. Both the prototype and later iOS app use these capabilities. [Supabase Edge Functions](https://supabase.com/docs/guides/functions).
  - Keep OpenAI and Apple signing secrets server-side. The browser receives only appropriately scoped public configuration and session credentials.
  - Use a small Postgres operational store for expiring session/attempt records and atomic usage counters. Do not persist exploration preferences, groups, question text, answer text, or precise geographic context there in phase 1.
  - Bind status lookup, cancellation, deduplication, and quota updates to the server-issued browser session that owns the attempt. An attempt ID alone must not grant access.
  - Proposed expiry: signed session/attempt credentials last 24 hours; operational attempt records last 48 hours. Reject expired credentials and never replay an expired attempt automatically. The user must explicitly start a new attempt if recovery is no longer available. Retain aggregate usage totals for the configured budget period.
  - The client provides the request type, selected area or place, current preferences, and relevant context. Discovery/refinement requests include their existing group when needed; place-answer requests include only that place's conversation. Validate shape and bounds, including which preferences apply to the new request.
  - Do not accept client-supplied budget values, system instructions, or a claimed authorization role as authoritative. Apply usage accounting and deduplication to discovery and refinement as well as chat.
  - For duplicate attempts, return their current status without issuing another paid request. If a completed answer was lost before local persistence, disclose that it cannot be restored from the metadata-only store and offer an explicit new attempt.

- **AI: OpenAI Responses API with web search.**

  - OpenAI is confirmed. Use structured, verified place candidates and current preferences for discovery; retrieve evidence for factual place explanations and chat answers. Preserve citation metadata and stream answer text when available. Reuse supported facts for follow-ups and refresh time-sensitive evidence.
  - Keep prompt rules, area or place context, explicit preferences, relevant conversation turns, and retrieved evidence distinct. The selected point is the subject of the question, not necessarily the user's current location. Preferences influence relevance and emphasis, not factual claims.
  - Pin the exact model after representative quality, latency, and cost checks. Set input, output, retrieval, and spending limits before enabling paid requests. No monthly budget has been supplied yet. [OpenAI web search documentation](https://developers.openai.com/api/docs/guides/tools-web-search).

- **Photos: optional Wikidata and Wikimedia Commons enrichment.**

  - Use verified entity matches and image references for landmarks where available. Retain the photographer, source, and license information required for each photo.
  - Fall back to a place icon when the image or reliable entity match is missing. Do not assume that MapKit exposes a standalone place-photo API.
  - Wikidata structured data is CC0; Commons images have individual reuse conditions. [Wikidata licensing](https://www.wikidata.org/wiki/Wikidata:Licensing) and [Wikimedia reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia).

- **Shared contracts.**

  - An area exploration references a geographic area, its preference versions, and an unordered group of place references. Group membership records suggested, added, and kept places; removed identities remain excluded from refreshes. Standalone places store their own optional preferences without requiring a group.
  - A place conversation references one place and may be opened from several explorations. Preserve original selected coordinates separately from matched coordinates and any provider- or source-qualified identity. Each question records its place, exploration context when present, and a preference snapshot that remains readable if the exploration is deleted.
  - During phase 1, explorations, preferences, groups, immutable context versions, questions, outputs, and source references persist only in IndexedDB. Discovery, refinement, and chat submissions have stable IDs; generation attempts have separate IDs, status, and timestamps.
  - The backend persists only session/submission/attempt identifiers, ownership, status, expiry, and usage metadata. In the later iOS app, account-owned explorations and conversation history move to Supabase as described in the deferred iOS requirements.
  - A source includes its URL, title, access time, and required attribution. Keep coordinate normalization and place-resolution rules versioned and consistent between client and server; no city allowlist is required.
  - Reuse these contracts and backend rules for iOS. Local history import into future accounts is not required.

- **Provider integration constraint.**

  - Map display metadata, stored history, and AI answer evidence have different usage rules. Verify the permitted fields and data flow before copying MapKit data into custom context storage or an AI request.
  - Use independently sourced evidence for factual answers. Do not assume full map-provider payloads can be retained indefinitely or used as unrestricted LLM evidence.
  - This remains a technical integration constraint to resolve before live implementation, not a claim that every Apple-to-AI use is prohibited. [Apple developer agreement, Attachment 6](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/).

### Later native iOS app

- **Client: Swift + SwiftUI + native MapKit.**

  - Use Core Location for foreground location, SF Symbols, Swift concurrency, and focused observable state. Proposed deployment target: iOS 18 or later. [Apple place APIs](https://developer.apple.com/videos/play/wwdc2024/10097/).
  - Replace the web UI with native views while retaining the validated behavior and shared backend.

- **Accounts and synced history: Supabase Auth + Postgres.**

  - Add native Sign in with Apple, account-owned explorations, preferences, conversations, and row-level security. Use the Supabase Swift SDK and enforce ownership in both backend requests and database policies.
  - Add SwiftData as a rebuildable local cache and Keychain-backed session storage. Supabase becomes the history source of truth. [Supabase Apple sign-in](https://supabase.com/docs/guides/auth/social-login/auth-apple) and [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

- **Keep infrastructure limited.**

  - No vector database, model training, dedicated search cluster, or multi-agent backend is required initially. Add curated place content only where evaluation reveals a specific gap worth addressing; a curated catalog is not required to explore a region.
