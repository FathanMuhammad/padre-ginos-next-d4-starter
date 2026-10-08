# Day 3 — Production React: Data, Security, Architecture

Central question: **where should state live, and who is allowed to change it?**

- Authentication = *who are you?* (GitHub OAuth → our own session cookie)
- Authorization = *what can you do?* (roles in OUR database, checked on the server)
- Hiding a button is not authorization.

## Setup

```bash
cp .env.example .env.local     # SESSION_PASSWORD + your own GitHub OAuth App
npm run dev
# sign in with GitHub once, then:
npm run role -- <github-login> admin
```

GitHub OAuth App (github.com/settings/developers → New OAuth App):
Homepage `http://localhost:3000`, callback `http://localhost:3000/auth/github/callback`.

`AUTH_DEV_LOGIN=1` adds "masuk sebagai demo user" on `/login` (customer / staff / admin).
It works with `next dev` **and** `next start` so Day 4 can measure production builds.
Never set it on a deployed server.

## Roles

| Permission | customer | staff | admin |
|---|---|---|---|
| `admin:view` (dashboard, orders) | | ✅ | ✅ |
| `orders:update` | | ✅ | ✅ |
| `products:manage` (products, prices) | | | ✅ |

## Step map

| Tag | What changes | Who |
|---|---|---|
| `d3-start` | Prep (not taught): `users` table + 3 demo users (migration in `src/lib/db.ts`), `src/lib/users.ts`, `npm run role`, deps `arctic` `iron-session` `zod`, `.env.example` | — |
| `d3-01` | GitHub OAuth (Arctic) route handlers, encrypted session cookie (iron-session), DAL `getCurrentUser()`, `/login`, user menu in Suspense, dev login | Instructor |
| `d3-02` = `d3-p1-start` | `permissions.ts`, `requirePermission()` → `unauthorized()` / `forbidden()`, checks in the DAL (`admin-data.ts`) and as the first line of `updateOrderStatusAction`, zod `orderStatusInput` | Instructor |
| `d3-03` = `d3-p1-solution` | **P1:** products admin-only (DAL, edit page, `updatePricesAction`), nav hint | Students |
| `d3-p2-start` | `/account` skeleton with TODOs | — |
| `d3-04` = `d3-p2-solution` | **P2:** user updates own profile: `requireUser()`, `profileSchema`, `useActionState`, `refresh()` | Students |
| `d3-p3-start` | "Flexible profile" refactor from a teammate: **2 security holes** | Students |
| `d3-05` = `d3-p3-solution` | **P3:** user id from the session, only validated fields saved | Students |
| `d3-end` = `d4-start` | Day 3 finished state | — |

## Verified (production build, Playwright)

| Check | Result |
|---|---|
| Session cookie | `httpOnly`, not readable from JS; tampered cookie = signed out |
| `?next=` | own paths kept; `//evil.example` → `/` |
| `/auth/github` | 307 to `github.com/login/oauth/authorize`, `scope=read:user`, `state` + state cookie |
| Callback with wrong state / cancelled | `/login?error=state` / `/login?error=cancelled` |
| Anonymous on `/admin/*` | 401 page, "Masuk" returns to the page after login |
| Customer on `/admin/*` | 403 page |
| Order status Server Action replayed (copied request) | before the action check: customer and anonymous **succeed**; after: 403 / 401, order unchanged |
| Price Server Action replayed by staff / customer | 403, shop price unchanged |
| Profile: errors per field, values kept, header updates, persisted | yes |
| `d3-p3-start` exploits | customer renames staff (IDOR) and makes themselves admin (mass assignment) |
| `d3-05` | both exploits rejected |

Notes:

- Pages that check inside a streamed segment keep **HTTP 200** (401/403 UI is shown, Next adds `noindex`), like `notFound()` on Day 2. Server Actions return real **401/403**.
- `forbidden()` / `unauthorized()` need `experimental.authInterrupts` (still experimental in Next 16.3.8).
- The full GitHub round trip needs a real OAuth App and internet; in the build sandbox only the redirect, state checks and error paths were exercised.
