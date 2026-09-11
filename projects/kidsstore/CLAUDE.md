# CLAUDE.md -- KidsStore

## Brand
- Name: KidsStore
- Category: children's clothing, toys and accessories
- Mission: Premium pieces for childhood, made to be kept
- Positioning: not a mass-market kids store, but a curated premium selection — quality, safe materials, durability
- Tone: warm, trustworthy, without excessive "cuteness" — we speak to parents as adults who care about quality
- Audience: parents 25-40 who value quality and are willing to pay for it; make considered, not impulsive, purchases

## Localization
- Default language: Ukrainian (uk)
- Supported languages: uk, en, de, fr, pl
- Locale routing: `/uk/`, `/en/`, `/de/`, `/fr/`, `/pl/` (uk as root/default fallback)
- Currency/format: adapt per locale (UAH for uk, EUR for de/fr/pl, adjust for en)
- Tone consistency: preserve the warm, non-infantile voice across all translations — avoid a literal machine-translation feel in en/de/fr/pl

## Design Direction
- Style: minimalism with warm accents
- Palette: #FAF7F2 (background), #2B2B28 (text), #C97B5C (warm terracotta), #7A8B6F (muted sage)
- Typography: Fraunces (headings), Inter (body)
- Type hierarchy: headings large with generous line-height; body text compact, undecorated
- Mood: cozy, homely, quality-first
- Space & grid: generous whitespace, asymmetric compositions, avoid dense card grids
- Illustration: abstract organic shapes, line art instead of stock icon packs
- Photography: no stock photos. Natural light, visible fabric and material texture
- Materials/texture: linen, cotton, wood — texture should be felt digitally too (soft shadows, soft edges)
- Motion: restrained, one deliberate reveal per page — no blanket hover effects on every card

## Tech Stack
- Framework: Next.js (App Router) + TypeScript, strict mode
- UI: React, Tailwind CSS utility classes
- Data storage: SQLite via `better-sqlite3`, accessed through a single `src/lib/db.ts` module
  - Used for structured, queryable records: leads, callback requests, contact-form submissions, newsletter sign-ups
  - Chosen over a JSON file because concurrent writes (multiple simultaneous form submissions) are unsafe with plain JSON and SQLite gives atomic writes, indexing, and an easy upgrade path to Postgres later
  - Every "capture" action (callback request, contact form, newsletter) is logged as one row in its own table — see `src/lib/schema.sql`
- Mobile-first, responsive down to 360px
- Deploy: Vercel (preferred for Next.js) or Cloudflare Pages
- Performance target: Lighthouse 90+ on all core pages

## Code Quality
- Formatter: Prettier — semi: true, doubleQuote, printWidth 100, trailingComma "all"
  Plugin: prettier-plugin-tailwindcss (auto-sorts Tailwind classes, prevents duplicate/conflicting utility declarations)
- Linter: ESLint flat config, extends `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-config-prettier` (disables stylistic rules that fight Prettier)
- Import order: enforced via `eslint-plugin-simple-import-sort`, 4 groups separated by a blank line —
  1. Node builtins (`node:path`, `node:fs`)
  2. External packages (`react`, `next/*`)
  3. Internal aliases (`@/lib/...`, `@/components/...`)
  4. Relative imports (`./`, `../`)
- Accessibility: `eslint-plugin-jsx-a11y` recommended rules — non-negotiable given "Trust signals" and forms are core sections
- No `console.log` in shipped code — `no-console: warn`, escalate to `error` in CI
- Editor consistency: `.editorconfig` — 2-space indent, LF line endings, final newline, trim trailing whitespace
- Pre-commit: Husky + lint-staged — `eslint --fix` and `prettier --write` run on staged files before every commit, so a badly-spaced file never reaches a PR
- CI gate: `npm run lint` and `npm run typecheck` (`tsc --noEmit`) must both pass before merge/deploy

## Sections
1. Hero — full-screen, brand name and one sentence
2. Categories — clothing, toys, accessories (3 curated entry points)
3. About — brand story in 2-3 sentences
4. Trust signals — materials, safety certifications, return policy
5. Contact / Callback — short form (name, phone, message) that writes to the database
6. Footer — social links, locale switcher, copyright
