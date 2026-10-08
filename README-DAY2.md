# Day 2 — Full-Stack React: From UI to Server

Central question: **how does our React app become a real full-stack application?**

## Step map

| Tag | What changes | Who |
|---|---|---|
| `d2-start` (= `d1-end`) | Shop works; no staff dashboard yet | — |
| `d2-01` | Route groups `(shop)` / `admin`, admin layout + sidebar, `/admin/products` as a Server Component, `loading.tsx` | Instructor |
| `d2-02` | Dynamic route `/admin/products/[id]`, `error.tsx` (with `retry`), `not-found.tsx`, `usePathname` behind Suspense | Instructor |
| `d2-03` | **P1 solution:** `/admin/orders` (URL state: `?page`, `?date`, `next/form`) + `/admin/orders/[id]` | Students |
| `d2-04` | Price edit: `useActionState`, field errors, `updateTag("menu")`, `redirect` | Instructor |
| `d2-05` | **P2 solution:** order status with server-side transition rules | Students |
| `d2-p3-start` | Overview from a teammate: slow and fragile on purpose | Students |
| `d2-06` | **P3 solution:** per-widget Suspense, `catchError` boundary, cached aggregate | Students |
| `d2-end` | Day 2 finished state (Day 3 starts at `d3-start`, one prep commit later) | — |

The `orders.status` column is added by a one-time migration in `src/lib/db.ts`.

## Measured (production build)

| Check | Result |
|---|---|
| Overview: all widgets visible | `d2-p3-start` ~1.9 s · `d2-06` ~0.35 s |
| Overview with "Simulasi gagal server" | `d2-p3-start` whole page error · `d2-06` only the status widget fails |
| Price edit → shop detail page | new price immediately (with `updateTag`); stale without it |
| Illegal status change forced from the browser | rejected by the server |

Note: `notFound()` inside a streamed segment keeps HTTP 200 (UI shows the not-found page and Next adds `noindex`).
