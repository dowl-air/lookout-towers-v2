# AGENTS.md

## Project purpose

Lookout Towers is a Czech community site for lookout towers, observatories, and similar places with views. The app combines public content (homepage, maps, tower detail, search) with authenticated user features (profile, visits, favourites, ratings, personal progress, community statistics, tower submissions/changes).

## Verified stack

- Next.js 16 App Router with `cacheComponents: true` and React Compiler enabled.
- React 19 and TypeScript.
- Tailwind CSS 4 + daisyUI.
- Auth.js / NextAuth v5 beta with Firebase adapter.
- Firestore + Firebase Storage.
- Client-side Czech QR Payment generation with `qrcode`.
- ESLint flat config with import ordering enforced.

## Repository map

- `app/`: App Router pages, layouts, route groups, and API routes.
- `actions/`: Server Actions (`"use server"`) for writes, auth checks, redirects, and mail sending.
- `data/`: Server-side read layer, typically cached with `react` cache + `next/cache` tags.
- `components/`: UI components; some are server components, some client components.
- `utils/`: Shared helpers for Firebase, cache tags, serialization, formatting, and normalization.
- `types/`: Shared TS types used across server and client code.
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

### Analytics

- Vercel Web Analytics is integrated with `@vercel/analytics`; it must be enabled in the Vercel project dashboard.
- Track confirmed mutations with `trackAnalyticsEvent` from `@/utils/analytics.server` after a successful write. Analytics delivery must not cause the user action to fail.
- Do not track cached server-rendered page views from server code: use the small client-side page-view tracker when a real browser page view is required.
- Outbound links that require reliable measurement should use `/api/analytics/outbound`, which records the event server-side and redirects only to a server-derived, validated destination.

### User deletion policy

Only the ID-based administrator may delete user accounts. Account deletion must never delete the administrator's own account and must be authorized in `proxy.ts`, the server-rendered admin page, and the corresponding Server Action.

When deleting an account, remove the user document, Auth.js accounts and sessions, the user avatar, and personal `visits`, `favourites`, and `ratings` records. Keep `changes` records and tower photos in `photos` (including their Storage files), even when they were created by the deleted user. UI that resolves a user for retained history must render a neutral fallback such as "Deleted user" when the user document no longer exists. Any new user-owned data collection must be explicitly classified as deleted with the account or retained as a documented exception.

Only the ID-based administrator may delete towers through `/remove-tower`. Tower deletion is irreversible and must require confirmation of the exact tower name. It deletes the tower document, linked `photos`, `favourites`, `ratings`, `visits`, and `changes` records, plus Firebase Storage files under both `towers/{towerId}/` and `towers_users/{towerId}/`. Invalidate global and tower-specific cache tags, including affected users' favourites, ratings, visits, and change-history tags.

Only the ID-based administrator may manage gallery photos through `/<type>/<nameID>/edit-photos`. The page combines legacy files from `towers/{towerId}/` with public documents from `photos`. Setting the main photo updates `mainPhotoUrl`; deleting the current main photo is blocked until another photo is selected. Every mutation must invalidate the tower, gallery, photo, map, random-tower, and tower-of-the-day cache tags.

Protected routes currently include:

- `/navstivene`
- `/pokrok`
- `/komunita`
- `/pridat-rozhlednu`
- `/profil`
- `/purge-cache`
- `/remove-tower`
- `/:type/:nameID/edit-photos`
- `/zmeny`
- `/admin`

The `/podporit` route is public. It generates SPD QR Payment data in the browser from fixed values in `constants/support.ts`; never accept the destination account from URL parameters or other user input. The displayed domestic account and encoded IBAN must always refer to the same account.

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
- `npm run ai-test`
- `npm run generate-towers-texts`
- `npm run scrape:add-tower -- <Mapy.cz URL>`
- `npm run scrape:add-tower:test`
- `npm run scrape:sync-mapy-towers -- --start-index 50 --limit 10`
- `npm run scrape:sync-mapy-towers:test`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

### Browser verification

- Do not add Playwright tests in this project.
- User-facing functionality is verified live in the browser only when the change is large enough to warrant it or when visual/runtime behavior needs confirmation.

## Known sharp edges

- The project uses strict server/client boundaries from modern Next.js, so serialization mistakes show up quickly in dev and build.
- `proxy.ts` is used for route protection; changing protected routes usually requires updating the matcher.
- `next.config.ts` enables caching and server actions, so seemingly simple data changes can require both serialization and cache-tag updates.
- Some server actions write through `@/utils/firebase` rather than `@/utils/firebase-admin`; keep new code consistent with the surrounding module unless there is a clear reason to refactor.
- The Mapy scraper stores intermediate Tower-shaped documents in `towers_scraped` only when invoked with `--write`. The `/pridat-rozhlednu` workflow imports ready records into `towers` and marks their source record as imported only after final creation and photo upload.
- The Mapy scraper maps `datum dokončení`, `datum založení`, or `datum otevření` to `opened` only for a validated four-digit year, ISO date, numeric Czech day/month/year date, or Czech textual-month date. They take precedence in that order. Invalid or ambiguous source values remain unmapped key-values.
- `scripts/towers_mapy_sync.ts` re-scrapes existing `mapycz` records in stable, indexed, interactive batches. It logs each tower with its zero-based global batch index. It is a dry run unless `--write` is passed. With `--auto`, it skips missing Mapy.com IDs, scraping failures, and towers without usable differences, and automatically approves all proposals; `--write` remains required for persistence. It proposes every usable Mapy.com difference after a per-tower confirmation, except it only fills a missing or zero height, elevation values that are missing, `null`, `0`, or `1`, opening hours that are missing or `Unknown`, and an `opened` value only when the field is undefined or `null`. It ignores unknown or empty source values, preserves missing contact and admission details, never updates `mapycz`, and purges the specific tower cache after each confirmed write.
- Only the administrator may add towers or update a tower's `mainPhotoUrl`.
- URL-based photo import is administrator-only and is used exclusively by the `/pridat-rozhlednu` workflow. Do not expose it to regular users because it creates an SSRF boundary.
- Serialize every JSON-LD value rendered with `dangerouslySetInnerHTML` through `serializeJsonLd` from `@/utils/structuredData`.
- The support payment destination is configured in `constants/support.ts`. Keep the domestic account and IBAN synchronized and validate the IBAN checksum after any change.

## Safe change checklist

Before editing:

1. Identify whether the code is server-only, client-only, or crossing the boundary.
2. Check whether a matching helper already exists in `data/`, `actions/`, or `utils/`.
3. Identify which cache tags are read and which action should invalidate them.
4. Identify the narrowest verification step: lint, typecheck, build, or live browser verification.

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
- browser-based verification expectations,
- the Firestore serialization pitfall.

Use `README.md` for onboarding and local setup. Use this `AGENTS.md` as the repository-specific operational guide for implementation details, cache behavior, server/client boundaries, and safe change practices.
