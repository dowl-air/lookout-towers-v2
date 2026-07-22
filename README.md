# Lookout Towers

Lookout Towers is a Czech community website for lookout towers, observatories, and similar places with a view. It combines a public catalogue of towers with authenticated user features such as visits, favourites, ratings, profile pages, personal progress, and community statistics.

## Highlights

- Public pages for homepage, map, tower detail, listing, and search.
- Authenticated user flows for visits, favourites, ratings, personal progress, profile history, and profile editing.
- Community and moderation-oriented features, including tower submissions and change tracking.
- Firestore-backed data model with server-side caching and tag-based invalidation.

## Tech stack

- Next.js 16 App Router with Turbopack and Cache Components.
- React 19 + TypeScript.
- Tailwind CSS 4 + daisyUI.
- Auth.js / NextAuth v5 beta with Firebase adapter.
- Firebase Firestore + Firebase Storage.
- Typesense for search.

## Quick start

### Prerequisites

- Node.js 22+
- npm or pnpm
- Firebase project credentials for both client and admin access

### Install

```bash
git clone https://github.com/dowl-air/lookout-towers-v2.git
cd lookout-towers-v2
npm install
```

### Configure environment

Create `.env.local` and provide the values used by the app:

- Firebase client SDK: `FIREBASE_apiKey`, `FIREBASE_authDomain`, `FIREBASE_databaseURL`, `FIREBASE_projectId`, `FIREBASE_storageBucket`, `FIREBASE_messagingSenderId`, `FIREBASE_appId`
- Firebase admin / Auth adapter: `GOOGLE_PRIVATE_KEY`, `GOOGLE_PROJECTID`, `GOOGLE_CLIENT_EMAIL`
- OAuth providers: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SEZNAM_CLIENT_ID`, `SEZNAM_CLIENT_SECRET`
- Search: `TYPESENSE_HOST`, `TYPESENSE_KEY`
- AI scripts: `OPENROUTER_API_KEY`
- Mail: `SMTP_SERVER_USERNAME`, `SMTP_SERVER_PASSWORD`, `SITE_MAIL_RECIEVER`
- Optional analytics: `CLOUDFLARE_ANALYTICS_TOKEN`

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Profile settings

Authenticated users can edit their display name and profile photo on `/profil`. Display names must contain 1 to 50 characters after trimming surrounding whitespace. Profile photos must be JPG, PNG, or WebP files no larger than 5 MB.

## Available scripts

- `npm run dev` — start the development server
- `npm run ai-test` — run the OpenRouter hello-world script from `scripts/hello-ai.ts`
- `npm run generate-towers-texts` — generate `heroDescription` and `seoDescription` drafts for towers with OpenRouter
- `npm run scrape:add-tower -- <Mapy.cz URL>` — scrape a Mapy.cz place detail into a JSON document
- `npm run scrape:add-tower:test` — run focused parser tests for the Mapy.cz scraper
- `npm run build` — create a production build
- `npm start` — run the production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript without emitting files

## Mapy.cz tower scraper

The `scrape:add-tower` script opens a Mapy.com place detail and writes the result as a Tower-shaped JSON document. Add `--write` to store it in the Firestore `towers_scraped` collection; without that flag, it does not write to Firestore. The scraped document uses `created` and `modified` timestamps, stores the original Mapy.com metadata in `mapycz`, and keeps temporary gallery URLs in `photos` for later import. It does not create a final document in `towers`.

The exported `name` removes a leading Czech type label such as `Rozhledna`, `Výhledna`, `Pozorovatelna`, `Věž`, or `Vyhlídková věž`; occurrences later in the name are preserved. `nameID` uses the existing project format and is checked against the `towers` Firestore collection: a collision first adds the county suffix and then a numeric suffix. Unmapped Mapy.com key-value attributes are not stored; the script reports each as a warning on standard error. It collects up to eight random unique gallery images as full-size URLs in `photos`; if the gallery contains fewer images, it keeps all of them. `mainPhotoUrl` is randomly selected from this collected photo set. When both identifiers are available, `urls` also includes the canonical Mapy.com detail URL containing only `source` and `id`.

On `/pridat-rozhlednu`, authenticated users can select a ready document from `towers_scraped`. Its data and photo URLs prefill the existing form; after a successful final import, the scraped document is marked as imported.

Known `content-keyval` attributes are mapped to fields compatible with `Tower`: `výška` to `height`, `nadmořská výška` to `elevation`, and `počet schodů` to `stairs`. Any unknown or invalid value remains a `keyValues` label/value pair for later mapping.

`materiál` maps to the values in `MATERIALS` using Czech word roots, for example `ocel` to `kov`, `dřev` to `dřevo`, `beton` to `beton`, and `zdiv` to `zdivo`. Any source material that cannot be identified remains in `keyValues`.

`provozovatel` maps to `owner`. `content-admission` maps `zpoplatněný` to paid admission and `volný` to free admission. `nepřístupný` maps to permanently closed opening hours (`Forbidden` with `Banned`). A year-round `nonstop` schedule maps to `NonStop` opening hours and free admission.

The Mapy.com type is normalized to the project's `TowerTypeEnum`: `Rozhledna` maps to `rozhledna` and `Pozorovatelna zvěře` maps to `pozorovatelna`. `Věž budovy s vyhlídkou` defaults to `mestska_vez`; its name and description may refine it to `vodarenska_vez`, `hradni_vez`, `zamecka_vez`, `kostelni_vez`, or `mestska_vez` for a town hall. The place description is exported as `description`.

Contact data is exported as `contact.email`, `contact.phone`, and `contact.officialWebsite`. When present, the official website is the first item in `urls`.

When GPS coordinates are available, the scraper performs a Nominatim reverse-geocoding request and maps the verified result to the project's `country` code, `province` code, and `county` value. A failed or unsupported lookup does not fail the scrape and omits those fields.

Opening-hour tables are mapped into the existing `OpeningHours` shape. For Mapy.com dropdowns, every listed season is paired with the following season table by its position; closed seasons are omitted. Different opening intervals within one season become separate ranges with their corresponding weekdays. A note explicitly stating `po dohodě` or `příležitostně` maps to `Occasionally`. Split shifts, exceptions, or unparseable seasons are safely omitted. The scraper stores an opening-hours note in `openingHours.detailText` only when no usable range remains.

Chrome must be available on the host. Selenium Manager resolves a compatible ChromeDriver when the script starts. The scraper reads Firebase service-account variables from `.env.local` to verify `nameID` uniqueness. With `--write`, it also purges the `ScrapedTowers` Next.js cache tag through `SCRAPER_APP_URL` (default: `https://rozhlednovysvet.cz`). Set `SCRAPER_APP_URL` only when targeting a local or staging app. Pass the place URL as a positional argument or with `--url`:

```bash
npm run scrape:add-tower -- "https://mapy.cz/..."
npm run scrape:add-tower -- --write "https://mapy.cz/..."
```

JSON is written to standard output and operational logs are written to standard error, so callers can safely pipe the JSON to another process. Use `--output path/to/tower.json` to write the document to a file, and `--wait 15` to change the page-content timeout in seconds.

## Project structure

- `app/` — App Router pages, layouts, route groups, and API routes
- `actions/` — Server Actions for writes, auth checks, redirects, and mail sending
- `data/` — server-side read layer, typically cached with `cache()` + `cacheTag()`
- `components/` — reusable UI components
- `utils/` — Firebase, serialization, cache tags, formatting, and shared helpers
- `types/` — shared domain types
- `proxy.ts` — route protection for authenticated and admin-only areas

## Architecture notes

- Reads are primarily implemented in `data/` and use `@/utils/firebase-admin`.
- Writes are primarily implemented in `actions/` and use `@/utils/firebase` plus `updateTag(...)` for cache invalidation.
- Auth is configured in `auth.ts` with Google and Seznam providers.
- Protected routes currently include `/navstivene`, `/pokrok`, `/komunita`, `/pridat-rozhlednu`, `/profil`, `/purge-cache`, and `/zmeny`.
- Homepage SEO is route-specific: homepage metadata and JSON-LD live in `app/(with-navbar)/(with-footer)/page.tsx`, and the homepage share image is generated by the route-level `opengraph-image.tsx` and `twitter-image.tsx` files.

## Verification

Use `npm run typecheck` and `npm run lint` for code checks. User-facing functionality is verified live in the browser when the change is large enough to warrant it or when visual/runtime behavior needs confirmation.

## Important implementation detail

Firestore `Timestamp`, `GeoPoint`, and similar objects must not cross the server/client boundary unmodified. If raw Firestore values are passed to Client Components, Next.js build or render can fail with errors about “Only plain objects”.

Use the existing helpers when shaping data for UI:

- `@/utils/serializeFirestoreValue`
- `@/utils/normalizeTowerObject`

## Contributing notes

- Keep imports grouped and alphabetized; ESLint enforces `import/order`.
- Prefer existing helpers in `data/`, `actions/`, and `utils/` before adding new abstractions.
- When changing a mutation, update the related cache invalidation in `@/utils/cacheTags.ts`.
- For larger user-visible changes, verify the affected flow live in the browser.

## Maintainer

- [Daniel Patek](https://github.com/dowl-air)
