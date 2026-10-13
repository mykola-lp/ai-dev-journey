# Field & Form — Next.js Storefront (Test Assignment)

A small storefront built for the JavaScript Developer (Next.js/React) test
assignment: a home page with switchable product layouts and drag-and-drop
reordering, a product detail page, and a cart — all running fully locally,
in Ukrainian and English.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to
`/uk` by default. Switch to English with the `EN` button in the header, or
go straight to `/en`.

Other useful scripts:

```bash
npm run build      # production build (also statically generates every
                    # locale × product page)
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

No environment variables, API keys, or external services are required —
the catalogue is a local JSON file and everything renders offline.

## What's implemented

- **Home page (`/`)** — product catalogue with:
  - Three interchangeable layouts: a classic grid card, a large 2-column
    card with a bigger swatch and description, and a compact list row.
  - A layout switcher (top right of the toolbar) that persists the choice
    to `localStorage`.
  - Drag-and-drop reordering (via the grip handle on each item) that
    persists across reloads and survives switching layouts or filters.
  - Bonus filtering by category and by a max-price slider, both
    implemented as query parameters on the `/api/products` route.
- **Product page (`/product/[id]`)** — full description, price, and an
  "Add to cart" action. Statically generated at build time for every
  product/locale combination (`generateStaticParams`).
- **Cart (`/cart`)** — quantity editing, line removal, a subtotal, and a
  mocked "Checkout" button (see [Checkout](#checkout) below).
- **Ukrainian / English i18n** — `uk` is the default locale, `en` is the
  second. Adding a third language is a matter of adding
  `messages/<locale>.json` and one line in `i18n/routing.ts`.

## Architecture decisions

**App Router + Server/Client split.** Pages that don't need interactivity
(the product detail page, the page shell around the shop) are server
components, so they're statically generated. Anything stateful — the
product grid, cart, filters, view switcher — is a client component.

**State management: React Context, not Redux Toolkit.** The app has two
genuinely independent pieces of client state (the cart, and the
view/ordering preference), neither with complex derived state or
cross-cutting async logic. Two small `useState`-backed contexts
(`CartContext`, `ViewContext`) cover that without the extra dependency and
boilerplate Redux Toolkit would add. If the catalogue grew to need
optimistic updates, undo/redo, or shared state across many independent
features, Redux Toolkit (or Zustand) would earn its place — it doesn't
here.

**Drag and drop: `@dnd-kit`, not `react-beautiful-dnd`.**
`react-beautiful-dnd` is no longer maintained and has known issues under
React 18 Strict Mode (which this project uses). `@dnd-kit` is actively
maintained, has no legacy React constraints, and its `useSortable` hook
maps cleanly onto "any of three different card layouts can be dragged."
Each card exposes an explicit grip handle (rather than making the whole
card draggable), so a plain click still navigates to the product page or
adds it to the cart without being mistaken for a drag gesture.

**Where the drag order lives.** `ViewContext` keeps a single ordered list
of every product id the user has encountered, independent of whatever the
current category/price filters return. Reordering rearranges that master
list; filtering just re-projects it onto a subset. That way, reordering
under one filter doesn't get lost when the filter is cleared.

**Product images.** The assignment forbids calling out to any external
API or service, and there's no real product photography to ship inside a
code test. Rather than link to a stock-photo CDN (which would violate
that constraint) or embed large binary images in the repo, every product
renders a flat colour swatch (from the product's own `accentColor`) with
a small category line-icon. It's a deliberate placeholder, documented
inline in `ProductSwatch.tsx`.

**Fonts.** `tailwind.config.ts` lists a display serif and a grotesque
sans first in the font stacks, but there is no `@font-face`, Google Fonts
`<link>`, or `next/font/google` call anywhere. That means the app never
makes a network request for type — it just falls back to the visitor's
system fonts, which keeps the "runs completely locally" requirement
intact. Swap in a real webfont by adding a `next/font` import if the
network constraint doesn't apply to your environment.

**Getting product data via API routes.** The home page's product grid
fetches from `/api/products` (with `category`/`maxPrice` query params) on
the client, rather than importing the catalogue JSON directly into a
client component. This is what actually exercises the "Next.js API
Routes for product data" requirement, and it's also what makes the bonus
filtering feel like a real client/server round trip. The product detail
page is statically generated instead, so it reads the local data module
directly at build time — there's no benefit to routing a build-time read
through an HTTP call to itself.

## Project structure

```
app/
  [locale]/
    layout.tsx              # html/body shell, i18n + Cart/View providers, header
    page.tsx                 # home page (server component)
    product/[id]/page.tsx     # product detail (server component, SSG)
    cart/page.tsx              # cart (client component)
  api/
    products/route.ts          # GET /api/products?category=&maxPrice=
    products/[id]/route.ts      # GET /api/products/:id
components/
  layout/                       # Header, LanguageSwitcher
  product/                      # 3 card variants, swatch, drag handle,
                                 # view switcher, filter bar, dnd wiring
  shop/ShopClient.tsx            # ties filters + view + grid + fetch together
  cart/                          # CartItem, CartSummary
context/
  CartContext.tsx                # cart lines, persisted to localStorage
  ViewContext.tsx                # layout mode + drag order, persisted too
data/products.json                # local product catalogue (bilingual)
lib/                                # types, product/filter helpers, price formatting
messages/{uk,en}.json                 # UI translation strings
i18n/                                  # next-intl routing + request config
middleware.ts                           # locale detection/redirect
```

## Known limitations (by design, given the scope of a test task)

- No real backend/database — `data/products.json` is the single source of
  truth, read directly by the API routes.
- Checkout is intentionally a no-op: it clears the cart and shows a
  confirmation message instead of contacting a payment provider, since
  the assignment explicitly rules out external services.
- No automated test suite; verification here was manual (`npm run build`,
  a full static export of every locale/product route, and a smoke test of
  every page and API route during development).
