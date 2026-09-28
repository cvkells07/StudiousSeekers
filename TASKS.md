# StudiousSeekers Tasks

This lists what each person owns. Check off tasks as you complete them, and add new ones as they come up — this file should stay current, not just be a one-time plan.

## How everyone's work connects

Before anyone builds their piece, we need one shared document: **the API contract**. This is just a plain description of what data goes back and forth between the React app (`client`) and the Python API (`server`) — e.g. "hitting `GET /spots` returns a list of spots that look like this: `{id, name, building, quiet_level, has_outlets, upvotes}`."

Once this contract is written down and everyone agrees on it, **Person B and Person D can build their React features against fake/mock data matching that shape**, without waiting for Person C to actually finish the real API. Later, they just swap the mock data for a real API call — the shape hasn't changed, so nothing breaks.

This is the single most important thing to get right early. If the contract changes later, whoever changes it must tell the whole team immediately, since it affects everyone's code.

*(Suggestion: keep the actual contract in its own file, e.g. `API_CONTRACT.md`, so it's easy to find and update. Want me to draft a starting version of that too?)*

## Person A — Design System & Core UI
- [ ] Wireframe the core screens in Figma (home/search page, spot detail view, filter panel)
- [ ] Build reusable components in `client/src/components/`: buttons, cards, nav bar, layout shell
- [ ] Set up base routing/page structure
- [ ] Document component props/usage briefly so B and D know how to use them

*Depends on: nothing — this is the first thing built, everyone else builds on top of it.*

## Person B — Search & Filter Interface
- [ ] Build the search bar UI (using Person A's components)
- [ ] Build filter controls (building, quiet level, outlets, hours, capacity)
- [ ] Wire filter state to the results list
- [ ] Once the real API exists, connect search/filter requests to it (per the API contract)

*Depends on: Person A's components, the API contract (can start against mock data before C finishes).*

## Person C — Data Layer & API
- [ ] Design the data model for a "study spot" (fields, types)
- [ ] Collect/catalog real campus study spot data (seed data)
- [ ] Write the API contract doc (`API_CONTRACT.md`) — share with team for agreement before building
- [ ] Build FastAPI endpoints matching the contract (`GET /spots`, filtering, etc.)
- [ ] Add basic data validation

*Depends on: nothing to start — this can begin immediately alongside Person A.*

## Person D — Boost / Recommendation Feature
- [ ] Design the upvote/boost UI (using Person A's components)
- [ ] Build the upvote/rating endpoint in FastAPI (with Person C's help on data model)
- [ ] Add sorting by popularity to the results list
- [ ] (Stretch) simple "recommended for you" logic — time of day, tags, proximity

*Depends on: Person A's components, Person C's data model for how upvotes are stored.*

## Lead (you)
- [ ] Keep the API contract and this file up to date as things change
- [ ] Review every PR before merging to `main`
- [ ] Unblock whoever's stuck — float between people rather than owning one big feature
- [ ] Run weekly check-ins against SCHEDULE.md
- [ ] Own the initial project scaffolding and any shared config (already done ✅)

---
**Adding a new task:** if you think of something that needs doing and it's not listed here, add it under the right person (or under Lead if it's unclear who owns it) rather than just doing it silently — keeps everyone aware of what's actually in progress.
