# Aura by Bel — Studio Dashboard

The admin app for **Bel** to run the business. A **separate app** from the public
storefront (`../aura`), Vue 3 + Vite + Pinia, matching the storefront's design.

Data is persisted in the browser (localStorage) for now and shaped to mirror the
storefront, so a future **FastAPI/Postgres** backend can serve both apps without
UI changes.

## Run it

```bash
nvm use            # Node 24
npm install
npm run dev        # http://localhost:5174  (storefront runs on 5173)
npm run build
npm run preview
```

## What Bel can do

- **Overview** — revenue, processing orders, upcoming bookings, low-stock at a glance.
- **Products** — add/edit/delete with name, type, collection, price, **compare-at price
  (sale slash)**, description, tags, **buy-now vs pre-order**, **variants (e.g. wig
  sizes/inches)**, stock, and badge.
- **Bookings** — see requests and change status (requested → confirmed → completed /
  cancelled).
- **Availability** — set working days, opening hours, and block specific dates.
- **Inventory** — adjust stock per buyable product; low/out-of-stock flags.
- **Orders** — track sales, see balances, **mark delivered** / cancel / reopen.
- **Customers** — list clients; click a row to see their orders and appointments.

## Structure

```
src/
  store/        products, bookings, orders, customers, availability  (+ persist plugin)
  data/seed.js  first-run demo data (mirrors the storefront shapes)
  views/        OverviewView, ProductsView, BookingsView, AvailabilityView,
                InventoryView, OrdersView, CustomersView
  components/   SidebarNav, AppModal, ProductForm, ProductThumb
  router/       hash-routed sections
  styles/       tokens.css, base.css, app.css (shared admin utilities)
```

## Connecting the backend later

Each Pinia store hydrates from / saves to localStorage via `store/persist.js`.
Swap that for API calls (the store actions are the single place to do it). The data
shapes (`products`, `bookings`, `orders`, `customers`, `availability`) map directly to
DB tables.

## Login

The whole app is gated by an admin login (`src/store/auth.js` + `LoginView.vue`).
It's a **mock** for now — demo credentials `bel@aurabybel.com` / `studio` — and the
session persists in localStorage; sign out from the sidebar footer.

> Before deploying anywhere public, replace `signIn()` with real auth (e.g. Supabase
> Auth + an admin-role check, ideally the same provider the storefront uses). The gate
> and logout don't change.
