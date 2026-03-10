# AGENTS.md

## Project purpose

Lookout Towers is a Czech community site for lookout towers, observatories, and similar places with views. The app combines public content (homepage, maps, tower detail, search) with authenticated user features (profile, visits, favourites, ratings, community statistics, tower submissions/changes).

## Verified stack

- Next.js 16 App Router with `cacheComponents: true` and React Compiler enabled.
- React 19 and TypeScript.
- Tailwind CSS 4 + daisyUI.
- Auth.js / NextAuth v5 beta with Firebase adapter.
- Firestore + Firebase Storage.
- Playwright for end-to-end coverage.
- ESLint flat config with import ordering enforced.

## Repository map

- `app/`: App Router pages, layouts, route groups, and API routes.
- `actions/`: Server Actions (`"use server"`) for writes, auth checks, redirects, and mail sending.
- `data/`: Server-side read layer, typically cached with `react` cache + `next/cache` tags.
- `components/`: UI components; some are server components, some client components.
- `utils/`: Shared helpers for Firebase, cache tags, serialization, formatting, and normalization.
- `types/`: Shared TS types used across server and client code.
- `tests/`: Playwright end-to-end tests.
- `proxy.ts`: Route protection for authenticated/admin areas.

## Runtime architecture

### Read path

Most reads live in `data/` and use this pattern:

- `cache(async () => { "use cache"; ... })`
- `cacheLife(...)`
- one or more `cacheTag(...)` calls
- Firestore reads through `@/utils/firebase-admin`

Examples:

- `data/tower/towers.ts`
- `data/user/users-community.ts`
- `data/change/changes.ts`

### Write path

Most writes live in `actions/` and use this pattern:

- file starts with `"use server"`
- authentication via `checkAuth()` or route-level protection
- Firestore writes using the modular Firebase SDK from `@/utils/firebase`
- cache invalidation with `updateTag(...)`

Examples:

- `actions/ratings/ratings.action.ts`
- `actions/visits/visits.action.ts`
- `actions/towers/tower.add.ts`

### Auth

- Auth is configured in `auth.ts`.
- Providers: Google and Seznam.
- Adapter: `FirestoreAdapter(authFirestore)`.
- Authenticated/admin route guarding is handled in `proxy.ts`.
- Admin logic is currently ID-based (`iMKZNJV5PE4XQjnKmZut`).

Protected routes currently include:

- `/navstivene`
- `/komunita`
- `/pridat-rozhlednu`
- `/profil`
- `/purge-cache`
- `/zmeny`

## Critical repository rules

### 1. Never pass raw Firestore values to client components

This repository already contains the main pitfall: Firestore `Timestamp`, `GeoPoint`, and document payloads are not safe to pass directly from server components to client components.

Use existing helpers before introducing new conversion logic:

- `@/utils/serializeFirestoreValue`
- `@/utils/normalizeTowerObject`

If data crosses the server/client boundary, make sure it is plain JSON-like data first.

This matters for pages such as the community page and tower detail pages, and it is also the reason builds can fail with errors like:

- `Only plain objects ... can be passed to Client Components from Server Components`

### 2. Keep cache invalidation consistent

If you add or change a mutation, update the relevant cache tags in the corresponding server action.

The central tag list is in `@/utils/cacheTags.ts`.

Common pattern:

- read functions declare `cacheTag(...)`
- write functions call `updateTag(...)`

Do not add new cached reads without deciding how they are invalidated.

### 3. Reuse existing data helpers

Before writing new Firestore queries, look for an existing function in `data/` or a normalizer/helper in `utils/`. The codebase already has dedicated modules for towers, users, ratings, visits, photos, and changes.

### 4. Respect server/client boundaries

- `data/` modules are server-side.
- `utils/firebase-admin.ts` is server-only.
- Client components must start with `"use client"`.
- Server Actions must start with `"use server"`.
- If a client component needs data from Firestore, fetch it in a server component or action and pass only serialized values down.

## Existing conventions

### Imports and paths

- Use the `@/` alias from `tsconfig.json`.
- Keep imports grouped and alphabetized; ESLint enforces `import/order`.

### Types

- Shared domain types live in `types/`.
- Prefer shaping data into existing types instead of passing raw Firestore documents around.

### Styling

- Tailwind utility classes are the default styling approach.
- daisyUI components are used throughout the UI.

### Language

- UI text in the app is mostly Czech.
- Documentation and comments should remain English.

## Testing and verification

### Available commands

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e`
- `npm run test:e2e:headed`

### Playwright notes

- Playwright expects a manually started local app.
- Base URL defaults to `http://127.0.0.1:3000`.
- Authenticated tests use `POST /api/test-auth/login`.
- That route only works outside production and only on `localhost` / `127.0.0.1`.

Useful test helpers:

- `tests/auth.ts`
- `tests/browser-errors.ts`

When changing user-visible behavior, prefer adding or updating a Playwright test if the flow is already covered by the suite structure.

## Known sharp edges

- The project uses strict server/client boundaries from modern Next.js, so serialization mistakes show up quickly in dev and build.
- `proxy.ts` is used for route protection; changing protected routes usually requires updating the matcher.
- `next.config.ts` enables caching and server actions, so seemingly simple data changes can require both serialization and cache-tag updates.
- Some server actions write through `@/utils/firebase` rather than `@/utils/firebase-admin`; keep new code consistent with the surrounding module unless there is a clear reason to refactor.

## Safe change checklist

Before editing:

1. Identify whether the code is server-only, client-only, or crossing the boundary.
2. Check whether a matching helper already exists in `data/`, `actions/`, or `utils/`.
3. Identify which cache tags are read and which action should invalidate them.
4. Identify the narrowest verification step: lint, typecheck, build, or Playwright.

Before finishing:

1. Confirm no raw Firestore `Timestamp` or similar object reaches a client component.
2. Confirm related cache tags are invalidated after writes.
3. Run the smallest relevant verification command first, then broaden if needed.
4. Update docs if the user-facing workflow, command surface, or required environment changes.
5. If you modify `README.md` or `AGENTS.md`, re-check the other file for stale statements and keep them consistent.

## README review summary

The current `README.md` now provides a solid contributor-facing overview of:

- project purpose and stack,
- local setup and required environment variables,
- primary scripts,
- high-level architecture,
- Playwright local-auth testing,
- the Firestore serialization pitfall.

Use `README.md` for onboarding and local setup. Use this `AGENTS.md` as the repository-specific operational guide for implementation details, cache behavior, server/client boundaries, and safe change practices.
