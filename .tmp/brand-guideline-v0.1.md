# Placewise brand guidelines

Version 0.1 · September 14, 2026 · Working draft for discussion

## Starting point

Placewise helps people get to know places through the questions they ask. The brand should make the world feel more interesting and exploring feel less effortful.

This draft draws on the [app PRD](PRD_DRAFT.md), the [implemented design system](DESIGN_SYSTEM.md), the [landing-page principles](../landing-page/landing_page_principles.md), and the recent direction toward immersive, scroll-led discovery. Teal Mist is the user-selected visual foundation. The user also selected the personality: **curious and thoughtful, with a little wit.** The positioning, messaging and detailed identity rules below are proposals. The PRD governs product scope; this document proposes how Placewise expresses it.

## The brand idea

**A little context changes the view.**

A building becomes more interesting when you understand why it looks that way. A neighborhood becomes easier to explore when a few places give you a way into it. A question can turn a passing glance into a connection.

Placewise starts with that moment of attention and helps it go somewhere. Someone can explore around their interests or select a point and ask without knowing its name. They stay in charge of what catches their attention and how deeply they follow it.

The emotional outcome: **“I understand this place a little better.”**

## Positioning

For curious, independent explorers, Placewise is a map-based way to understand places. It connects a selected area or point with relevant places, clear answers and sources people can check, keeping their questions attached to the location.

The defining interaction is simple: **the place supplies the context; the person supplies the curiosity.**

Lead with understanding and connection. Easier discovery and less scattered research support that promise. AI belongs in the explanation of how answers work, while the headline stays focused on what the person gets from using Placewise.

## Who we are speaking to

Start with curious, independent travelers who want enough context to choose what interests them and enjoy being there. The same person may research a neighborhood before a trip or ask one quick question while walking through it.

The invitation should also feel natural to someone exploring their own city, settling into a new neighborhood or looking around the world from home. Avoid assuming travel expertise, an expensive holiday or a famous destination. An ordinary street is a valid place to begin.

The audience is a mindset before it is a demographic: someone who notices something and wants to know more.

## Personality

**Curious.** Notice something specific. Ask “Why does this street curve here?” or “What was this building used for?” Let those questions carry the personality.

**Thoughtful.** Offer a useful first answer and room to go deeper. Give people enough context to make their own choices. Respect a quick question as much as a long conversation.

**Grounded.** Explain plainly, name the place clearly and make the evidence easy to find. Admit when something cannot be established. Confidence comes from being precise.

**Warm.** Use everyday language, contractions and an occasional light touch. Sound like an observant companion who enjoys explaining things. Keep moments of delight tied to the place itself.

The wit comes from observation and phrasing. **“‘What’s that?’ is a perfectly good place to start.”** is a proposed invitation that makes the product approachable and explains a useful behavior. Use that lightness sparingly in introductions and starter questions. Practical answers, errors and missing evidence stay plain and clear.

## Voice and writing

Say the useful thing first. Use short paragraphs, concrete nouns and active verbs. Match answer depth to the question. A practical question deserves a practical answer; a question about meaning or history can invite more detail.

Prefer “place,” “area,” “neighborhood,” “ask,” “explore,” “notice,” “understand” and “sources.” Use “story” when a story is relevant. Leave room for architecture, everyday businesses, geography and questions about visiting.

Keep “hidden gems,” “must-see,” “ultimate,” “unlock,” “revolutionary” and “AI-powered travel companion” out of the default voice. They add hype or imply authority the experience has not earned. Avoid making every question “little” or every place “magical.”

Use sentence case for headings, buttons and labels. Write the product name as **Placewise** in prose. Avoid em dashes, excessive exclamation marks and jokes in errors or uncertain answers. Preserve local place names and scripts.

## Messaging to try

**Primary headline: Get to know a place.**

Supporting copy: “Explore an area around your interests, or pick a point on the map and ask. Follow your questions with sources you can check.”

This is the clearest starting combination. It covers both area discovery and spontaneous questions, and works for travelers, residents and remote explorers.

**Expressive line: A little context changes the view.**

Use this in a campaign or immersive introduction, accompanied by a concrete place, question and answer. It expresses the feeling behind the product, while the supporting copy explains what someone can do.

**Short product description:** “Placewise helps you understand the places that catch your attention. Explore a few places around your interests, ask about a point on the map, and return to what you learned.”

For the current prepared demonstration, use **“Explore the example.”** Once the working prototype is available, **“Start exploring”** can become the primary action. A secondary **“See an example”** should lead directly to an example.

## Voice in the product

An open map can ask: **“What caught your eye?”** Support it with “Choose a place or select a point on the map to ask about it.”

An area exploration can ask: **“What are you curious about here?”** Support it with “Add your interests, or explore without preferences.”

A place conversation can begin: **“What would you like to know about this place?”** Keep the selected place visible, and use starter questions that fit it.

When evidence is missing: **“I couldn’t verify what this building was used for.”** Follow with any supported context, clearly identified as context about the surrounding area when applicable.

When identity is unresolved: **“We couldn’t identify this exact spot. You can still ask about the selected point.”** A lookup failure needs different copy: “Place lookup didn’t finish. Try again, or use the selected point.”

When an answer fails: **“The answer didn’t finish. Your question is still here.”** Offer a clear “Try again” action if retry is available.

For saved history: **“Saved in this browser.”** Supporting copy should explain that clearing browser data can remove it. Show this message only after a successful save. These are proposed patterns, to be matched to actual behavior before use.

## Visual direction

The place should feel vivid. The interface should give it room.

Build on Teal Mist with cool, light surfaces, deep teal text, restrained mint accents and generous spacing. Carry editorial warmth through typography, real places and observant copy. The overall feeling should be open, intelligent and approachable.

Earlier warm-paper and terracotta studies remain useful explorations of mood. They do not create a second palette to mix into the selected Teal Mist foundation.

### Color

Use the existing [theme tokens](../landing-page/src/theme.css) as the starting source of truth. This is a selection of working roles, not a complete production palette.

| Role | Current value | Brand use |
| --- | --- | --- |
| Page | `#F9FDFF` | Air and reading space |
| Surface | `#FFFFFF` | Answers and focused content |
| Editorial teal | `#075E59` | Headlines and emphasis |
| Deep teal | `#073F3D` | Occasional immersive sections |
| Primary action and selection | `oklch(0.704 0.14 182.503)` | The next action or active place |
| Action text | `#062B2B` | Dark text on the bright primary fill |
| Soft accent | `#C3ECDF` | Restrained supporting emphasis |

Keep most of the canvas quiet. Let photography and geographic detail provide variety. Reserve the strongest interface accent for action and selection. Pair selected color with a label, shape or other visible state. Check contrast in the actual component; a palette alone does not establish accessibility.

### Typography and composition

Keep **Georgia for editorial headlines** and **Inter for body text and controls** as the working pairing already implemented. This is a practical starting point; a distinctive display face can be explored after the brand direction settles.

Use comfortable body text around 16–18px, generous line height and readable line lengths. Treat answers, source links and place labels as useful content. They need to remain legible on a phone. Build hierarchy with scale, spacing and contrast, using an 8px spacing rhythm.

Give each composition a clear subject: a place, a question and something learned. Keep the map and active place connected to the answer. Short forms and a clear primary, secondary and ghost action hierarchy should make the next step easy to find.

For implementation, retain shadcn/ui primitives and existing shared components. Every interactive element needs visible hover, focus and disabled states, accessible labels and keyboard operation.

### Wordmark and symbols

The existing lowercase **placewise** wordmark is a starting point for artwork. Keep **Placewise** in written copy. The current compass and trailing period are provisional identity details.

A future mark could explore the relationship between a point and the context around it. Test recognition at app-icon size and in one color before committing. A final logo, clear-space rule and minimum-size specification are still to be developed. Avoid making a generic travel or AI symbol the main source of personality.

### Imagery

Show places someone could become curious about: street corners, facades, public spaces, local details and ordinary life. Balance recognizable landmarks with everyday places and varied geographies. Aim for the feeling of noticing something, with enough context to understand where it sits.

Use real, correctly identified photography to represent actual places. Preserve natural detail, attribution and useful alt text. The product uses category icons for businesses and honest fallbacks when identity or imagery is unavailable. Generated or fictional scenes can support a visibly labeled concept, but cannot stand in as evidence of a real place.

### Motion and immersion

Let scrolling unfold an encounter with a place. A point attracts attention; selecting it reveals a short explanation; a follow-up adds depth. This connects the immersive hero direction to the product promise.

Keep important content available through ordinary scrolling and accessible controls. Motion should help people understand what was selected and where the answer belongs. Support reduced motion. A staged landing-page sequence should remain clearly an example, without implying that the product generates a walking route or itinerary.

## Trust is part of the personality

Keep sources close to the claims they support. Say when evidence is incomplete, when a detail belongs to the surrounding area, and when a changing fact was checked. Let people distinguish a sourced fact from a suggestion based on their interests.

Use “select any point” to describe global exploration. Do not turn it into a promise of complete knowledge or an answer for every place. Groups of suggested places express possibilities; they do not establish rankings, opening status, verified accessibility or a schedule.

Describe availability accurately. The current landing page contains a prepared example. Live maps and AI answers belong to the planned web prototype. Native iOS, accounts and device sync come later. Local history does not imply that requests are processed entirely on the device.

## What to settle next

The personality and Teal Mist foundation give us a direction to build on. The next creative comparison should put the same place, question and answer into two headline treatments so the difference is easy to judge.

Test the direct headline “Get to know a place” against the expressive line “A little context changes the view,” each with clear supporting copy. Check whether people understand both ways into the product and what they can do today. These are creative hypotheses, not validated messaging.

Then refine the wordmark and app icon, settle the display typography, and test the identity on a landing-page introduction, a place answer and a missing-evidence state. The brand needs to feel coherent in all three.
