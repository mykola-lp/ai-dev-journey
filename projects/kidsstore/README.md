# KidsStore

Built from the CLAUDE.md brief: Next.js (App Router) + TypeScript, Tailwind, SQLite via `better-sqlite3`, 5 locales.

## Run it

```bash
npm install & npm run dev
```

Open http://localhost:3000 — that's `uk` (default, unprefixed). Other locales: `/en`, `/de`, `/fr`, `/pl`.

`npm run build && npm start` for a production build (this also pre-renders all 5 locales as static pages).

## What's here

- **`src/middleware.ts`** — locale routing. `uk` is the root/default (served at `/`, no prefix); other locales live under their own prefix. A visit to `/uk/...` redirects to the unprefixed path so there's one canonical URL per page.
- **`src/lib/i18n/`** — locale config + one JSON dictionary per language (`uk`, `en`, `de`, `fr`, `pl`). Each dictionary was written natively for its language, not machine-translated line by line, to keep the brand's tone consistent.
- **`src/lib/db.ts` + `src/lib/schema.sql`** — the single SQLite access point. Schema has three capture tables (`callback_requests`, `contact_messages`, `newsletter_signups`), one row per submission; the site currently wires up `callback_requests` since that's the only form in the brief's Sections list. WAL mode on, auto-creates `data/kidsstore.db` on first run.
- **`src/app/api/contact/route.ts`** — validates and inserts a callback request.
- **`src/components/`** — `Hero`, `Categories`, `About`, `TrustSignals`, `ContactForm`, plus `LocaleSwitcher` and `Footer`.

## Code quality

```bash
npm run lint          # eslint . — Next.js rules, a11y, import sorting, no-console
npm run lint:fix      # same, auto-fixes what it can
npm run format        # prettier --write . (Tailwind classes auto-sorted too)
npm run format:check  # CI-friendly, exits non-zero on drift
npm run typecheck     # tsc --noEmit
```

A Husky pre-commit hook (`.husky/pre-commit` + `lint-staged` in `package.json`) runs eslint and
prettier on staged files automatically, so a badly-formatted file can't reach a commit. Import
order is enforced, not just suggested: `eslint-plugin-simple-import-sort` groups every file into
node builtins → external packages → `@/` internal aliases → relative imports, one blank line
between groups — see any file under `src/` for the pattern.

## Design decisions worth knowing about

- Fonts (Fraunces + Inter) load via a `<link>` tag in the root layout rather than `next/font/google`, so the build doesn't depend on reaching Google's font CDN at build time — useful for restricted CI/sandbox environments. Functionally identical to `next/font` for the browser; swap back to `next/font/google` if you want automatic self-hosting/subsetting.
- Fraunces has no Cyrillic subset on Google Fonts, so Ukrainian/Cyrillic headline text will render in the fallback serif rather than Fraunces itself — expected, not a bug.
- Categories are deliberately asymmetric (7/5/12 column spans, no repeated card shadow) rather than three identical bordered cards — see `src/components/Categories.tsx`.
- Only one page-load animation (`animate-reveal` on the hero) — no per-card hover/fade choreography, per the brief's "one deliberate reveal per page."

## Not built yet (would need a follow-up brief)

- Actual product catalog/PDP pages — Categories currently link to `#`.
- Admin view for reading `callback_requests` out of SQLite.
- Contact-form and newsletter UI (schema exists, no form wired up — brief's Sections list didn't ask for these).
