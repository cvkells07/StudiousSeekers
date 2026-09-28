# StudiousSeekers Schedule

This is our week-by-week checkpoint list. The goal isn't to finish every single item exactly on time — it's to catch us early if we're falling behind, so we can adjust before it becomes a crisis.

## Week 1 (Sept 22–28) ✅ Done
- [x] Kickoff meeting, roles assigned
- [x] GitHub repo created, everyone cloned it
- [x] React (Vite) app scaffolded in `client/`
- [x] Python (FastAPI) app scaffolded in `server/`
- [x] ESLint configured
- [x] CONTRIBUTING.md written and pushed

## Week 2 (Sept 29–Oct 5)
- [ ] Finalize the API contract (see TASKS.md) — endpoint names and data shapes agreed on by everyone
- [ ] Person A: first reusable components built (buttons, cards, layout shell)
- [ ] Person C: data model decided, seed data collection started (real campus study spots)
- [ ] Everyone: first feature branch created and pushed (even if empty/barely started) — confirms git workflow works for everyone

**Checkpoint:** Can everyone successfully push a branch and open a PR by end of this week?

## Week 3 (Oct 6–12)
- [ ] Person A: component library mostly complete
- [ ] Person C: seed data finalized, first working API endpoint (e.g. `GET /spots`) live
- [ ] Person B: starts building search bar UI against A's components
- [ ] Person D: starts building boost/upvote UI and endpoint

**Checkpoint:** Does at least one real API endpoint return real data?

## Week 4 (Oct 13–19)
- [ ] Person B: search bar connected to live API data
- [ ] Person D: upvote button functional (UI + endpoint talking to each other)
- [ ] First merge of all four branches into `main` this week — even if rough

**Checkpoint:** Does the app run end-to-end locally (however roughly) with all four people's work merged in?

## Week 5 (Oct 20–26)
- [ ] Filter functionality (building, quiet level, hours, etc.) added to search
- [ ] Sorting by popularity/boost added to results
- [ ] Everyone: fix any bugs surfaced by the Week 4 merge

**Checkpoint:** Can a user search AND filter AND see boosted spots ranked, all in one flow?

## Week 6 (Oct 27–Nov 2) — Integration week
- [ ] Full integration pass: every feature working together in one app
- [ ] Expect this week to be messy — budget real time for merge conflicts and mismatched assumptions between people's code

**Checkpoint:** Does the whole app work as one connected experience, even if ugly?

## Week 7 (Nov 3–9)
- [ ] Bug fixes from integration week
- [ ] First round of testing with real users (classmates, friends)
- [ ] Collect feedback on confusing UI or missing features

**Checkpoint:** Have at least 5 people outside the team tried the app and given feedback?

## Week 8 (Nov 10–16) — Polish
- [ ] UI/UX polish based on feedback
- [ ] Responsiveness check (mobile view especially — students search on their phones)
- [ ] Edge cases handled (no results found, spot with no listed hours, etc.)

**Checkpoint:** Does the app look and feel finished, not just functional?

## Week 9 (Nov 17–23) — Buffer week
- [ ] Catch up on anything behind schedule
- [ ] Don't add new features this week — only fix and finish existing ones

**Checkpoint:** Is there anything still broken or half-done? This is the last real week to fix it.

## Week 10 (Nov 24–30) — Final push
- [ ] Final deploy (make sure the live/hosted version actually works, not just localhost)
- [ ] Prepare demo/presentation
- [ ] Final walkthrough as a team to make sure nothing embarrassing slipped through

**Checkpoint:** Could we demo this cold, right now, to someone who's never seen it?

---
**Note:** If any checkpoint above is clearly not going to happen on time, flag it to the team as soon as you notice — not the day it's due. Early warning is what buffer week is for.
