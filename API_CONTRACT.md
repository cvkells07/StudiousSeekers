# StudiousSeekers API Contract

This is the shared agreement between the React app (`client`) and the Python API (`server`). If you want to change anything here, message the team first — everyone's code depends on this staying consistent.

## The "Study Spot" data model

Every study spot in our system has this shape:

```json
{
  "id": 1,
  "name": "Library 2nd Floor Quiet Zone",
  "building": "Main Library",
  "quiet_level": "silent",
  "electricity": true,
  "capacity": "large",
  "hours": "24/7",
  "upvotes": 12,
  "tags": ["quiet", "outlets", "group-friendly"]
}
```

**Field notes:**
| Field | Type | Notes |
|---|---|---|
| `id` | number | Unique identifier, assigned by the server |
| `name` | string | Human-readable name of the spot |
| `building` | string | Which campus building it's in |
| `quiet_level` | string | One of: `"silent"`, `"quiet"`, `"moderate"`, `"loud"` |
| `has_outlets` | boolean | `true` or `false` |
| `capacity` | string | One of: `"solo"`, `"small"`, `"large"` |
| `hours` | string | Free text for now (e.g. `"24/7"`, `"8am-10pm"`) |
| `upvotes` | number | Starts at 0, incremented by the boost feature |
| `tags` | array of strings | Flexible list for anything else worth filtering by |

**If Person C or D needs to add a new field**, add it to this table and tell the team in chat before building against it — otherwise B's filter UI and D's sorting logic might not know it exists.

## Endpoints

### `GET /spots`
Returns all study spots.

**Response:**
```json
{
  "spots": [ /* array of Study Spot objects, as defined above */ ]
}
```

### `GET /spots?quiet_level=silent&has_outlets=true`
Returns filtered spots. Query parameters match the field names above exactly. Multiple filters can be combined.

**Response:** same shape as `GET /spots`, just a smaller filtered list.

### `POST /spots/{id}/boost`
Increments the upvote count for a specific spot by 1.

**Request:** no body needed, just the spot's `id` in the URL.

**Response:**
```json
{
  "id": 1,
  "upvotes": 13
}
```

### `GET /spots?sort=upvotes`
Returns all spots sorted by upvotes, highest first. (Person D can add more sort options here later — e.g. `sort=name` — and just needs to update this doc when they do.)

## Error responses

If something goes wrong, the API should return a shape like this, so React always knows what to expect:

```json
{
  "error": "Spot not found"
}
```

## What's still undecided (flag these in team chat when ready to lock in)

- [ ] Do we need user accounts, or is boosting anonymous for now? (Affects whether `POST /spots/{id}/boost` needs any user info attached.)
- [ ] Should `tags` be a fixed list of allowed values, or fully freeform?
- [ ] Do we need a `GET /spots/{id}` endpoint for a single spot's detail page?

---
**Updating this file:** whoever changes an endpoint or field should update this doc in the same PR as their code change — not after. If the code and this doc disagree, that's a bug waiting to happen.
