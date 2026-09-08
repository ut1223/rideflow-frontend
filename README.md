# RideFlow Frontend

A production-style frontend for the RideFlow ride-management platform — Rider, Driver, and Admin
applications in a single Next.js project, built entirely against the real RideFlow backend
(Node/Express/TypeScript/Prisma/PostgreSQL). Built as an SDE-1 portfolio project alongside
[rideflow-backend](../rideflow-backend).

No mock data, no invented endpoints: every screen reads and writes through the backend's actual
REST API, verified against its source code (routes, validators, services) rather than assumed
from documentation.

## Features

- JWT auth (register/login/refresh/logout) with automatic access-token refresh and role-based
  routing (RIDER / DRIVER / ADMIN)
- **Rider**: fare estimate → book ride → live status timeline → cancel → pay → rate driver, ride
  history, payments, notifications, support tickets
- **Driver**: profile setup, online/offline toggle (verification-gated), ride requests, full ride
  lifecycle (accept → arriving → arrived → start → complete), vehicles CRUD, document submission,
  earnings, ride history
- **Admin**: live dashboard KPIs, user/rider/driver management with search + filter + pagination,
  driver verification workflow, ride monitoring, payment oversight, support ticket management
- Centralized Axios client with automatic 401 → refresh → retry (single in-flight refresh, no
  infinite loops), consistent loading/empty/error/forbidden states everywhere, toasts, confirm
  dialogs for destructive actions

## Tech Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Axios · TanStack Query ·
React Hook Form · Zod · lucide-react · OpenStreetMap Nominatim (location search, no API key) ·
Server-Sent Events (native `EventSource`, no extra library)

## Architecture

```
Component → TanStack Query hook → Service (axios) → RideFlow Backend → Prisma → PostgreSQL
```

- `services/*.ts` — one file per backend resource; pure API calls, no business logic, unwrap the
  `{success, message, data}` envelope
- `hooks/**` — TanStack Query wrappers (`useQuery`/`useMutation`) around services; mutations
  invalidate the relevant query keys on success
- `features/**` — feature-specific forms/components (e.g. `features/rider/BookRideForm.tsx`)
- `components/ui`, `components/common`, `components/layout`, `components/tables`,
  `components/modals` — the shared design system (Button, Input, Modal, Pagination, StatusBadge,
  DashboardShell, ConfirmDialog, Toast, …)
- `providers/AuthProvider.tsx` — single source of truth for the current user (backed by
  `GET /auth/me`); `providers/QueryProvider.tsx` and `providers/ToastProvider.tsx` round out the
  provider stack in `app/layout.tsx`
- `lib/axios.ts` — the one Axios instance in the app; UI components never call axios directly
- `constants/ride-status.ts` — the ride status state machine and its badge colors, mirrored from
  the backend's whitelist table (`src/constants/ride-status.ts`) for UI purposes only; the
  backend remains the actual enforcement point

## Folder Structure

```
src/
├── app/                 # routes: (auth), rider/, driver/, admin/
├── components/          # ui/, common/, layout/, tables/, modals/
├── features/             # feature forms & feature-specific components
├── hooks/                # TanStack Query hooks, grouped by domain
├── services/             # one file per backend resource
├── lib/                  # axios client, query client, auth token storage, utils
├── providers/            # AuthProvider, QueryProvider, ToastProvider
├── types/                # types matching the backend's actual response shapes
└── constants/            # roles, ride-status state machine, status badge colors
```

## Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Copy `.env.example` to `.env.local` and adjust if your backend runs elsewhere. Never hardcode the
backend URL anywhere else in the codebase.

### Location search (no API key needed)

The pickup/destination fields on `/rider/book` are search-as-you-type boxes
(`src/components/common/LocationAutocomplete.tsx`), not manual lat/lng inputs. They're backed by
[OpenStreetMap's Nominatim search API](https://nominatim.openstreetmap.org/) — free, keyless, no
signup or billing required, called directly from the browser (`src/services/geocoding.service.ts`).
No backend changes were needed: the widget still produces the same
`pickupAddress`/`pickupLatitude`/`pickupLongitude`/... fields the backend already expected; only
*how the user enters them* changed.

Nominatim's usage policy asks for roughly ≤1 request/second and a way to identify the calling app;
browsers block setting a custom `User-Agent` from `fetch()`, so this relies on the `Referer`
header the browser sends automatically. Debouncing (400ms) plus request cancellation (an
in-flight search is aborted the moment a newer one starts) keeps real request volume well under
that limit for normal typing. Fine for dev/portfolio traffic; not intended for heavy production
load without self-hosting Nominatim or moving to a paid provider (Google Places, Mapbox, etc.) —
worth knowing if this ever needs to scale.

## Installation & Development

```bash
npm install
npm run dev       # http://localhost:3000
```

Requires the RideFlow backend running (default `http://localhost:5000`) with PostgreSQL migrated
and seeded — see `rideflow-backend/README.md`. Seeded logins:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rideflow.dev` | `Password123!` |
| Rider | `rider1@rideflow.dev` | `Password123!` |
| Driver (verified) | `driver1@rideflow.dev` | `Password123!` |
| Driver (unverified) | `driver3@rideflow.dev` | `Password123!` |

```bash
npm run build      # production build
npm run lint       # ESLint
npx tsc --noEmit   # type-check
```

## Authentication Flow

```
Landing (/) → Login/Register → POST /auth/login|register
  → { user, accessToken, refreshToken }
  → tokens persisted, user cached from the response
  → redirect by user.role (never a client-side role selector)
```

`AuthProvider` holds `GET /auth/me` as the canonical current-user query; `RoleGuard` (used in
each `app/{rider,driver,admin}/layout.tsx`) redirects unauthenticated visitors to `/login` and
redirects an authenticated user with the wrong role to *their own* dashboard — never a redirect
loop. Frontend role checks are for UX only; the backend's `authorize()` middleware is the actual
security boundary. A `403` from the API renders a dedicated `ForbiddenState`, not a redirect.

### Token storage

The backend is stateless JWT — tokens come back in the JSON response body, and there is no
server-side refresh-token persistence or httpOnly cookie support. Given that contract, both
tokens are stored in `localStorage` (mirrored by an in-memory cache for fast, synchronous reads
on every request) so a page reload doesn't force a re-login. This is a deliberate, documented
tradeoff — `localStorage` is readable by any script on the page — accepted because the backend's
actual design leaves no safer option (an httpOnly cookie would require the backend to set it,
which it doesn't). See `src/lib/auth.ts` for the implementation and rationale inline.

On a `401`, `src/lib/axios.ts`'s response interceptor calls `POST /auth/refresh` exactly once per
failing request (concurrent 401s share a single in-flight refresh promise), retries the original
request with the new access token, and — if refresh itself fails — clears local session state and
hard-redirects to `/login`.

## API Integration Notes (things that aren't obvious from the docs)

These were found by reading the backend's actual controllers/services/validators, not assumed:

- **Fare estimate vs. ride creation use different field names.** `POST /rides/estimate` returns
  `{ distance, duration, estimatedFare }`; `POST /rides` expects `{ estimatedDistance,
  estimatedDuration, estimatedFare }`. The booking flow (`features/rider/BookRideForm.tsx`)
  remaps these explicitly.
- **`GET /rides/:id` doesn't include the driver's name.** It includes the bare `Driver` relation
  (verification/online status, no nested `User`). Only `GET /users/me/rides` joins `driver.user`.
  Ride detail pages show what's actually returned (driver verification/online badges) rather than
  inventing a name.
- **There's no way to know ahead of time whether a ride has already been rated** — fixed by
  including the `rating` relation in `GET /rides/:id` (`findRideOrThrow` in `ride.service.ts`,
  backend). The rating form is now driven entirely by that real field: prefilled with the actual
  submitted stars/comment if present, the input form otherwise. The backend's
  `RIDE_ALREADY_RATED` error is still handled as a fallback for the rare two-tabs race.
- **Admin's `GET /admin/rides` and `GET /admin/payments` don't join rider/driver names** — only
  IDs. The admin Rides and Payments tables show truncated IDs for those columns rather than
  fabricating names.
- **A driver's `GET /rides` was scoped to only rides already assigned to them** — a `REQUESTED`
  ride (no driver yet) could never appear, which meant there was no way for a driver to discover
  ride requests at all. This was a real gap in the backend (not a frontend limitation), confirmed
  by reading `scopeWhereForUser` in `ride.service.ts` and cross-checked against the backend's own
  Postman-flow documentation, which assumes this works. Fixed with a minimal, additive change to
  that one function (`src/services/ride.service.ts` in the backend repo) so a driver's query also
  matches unclaimed `REQUESTED` rides — no other business logic, transitions, or authorization
  checks were touched.

## Real-time Notifications (Server-Sent Events)

Notifications now arrive live, no page refresh needed — this required a small, additive backend
change (not just frontend):

- `GET /notifications/stream` (backend, new) — an SSE endpoint. Since the browser's native
  `EventSource` can't set an `Authorization` header, it authenticates via `?token=` instead
  (`authenticateStream` in `auth.middleware.ts`); everything else still uses the normal header.
- Connections are tracked in-memory per user (`src/utils/sse.ts`, backend) — fine for this
  single-process deployment, lost on server restart (clients reconnect automatically).
- `completeRide` and `processPayment` push the newly created notification to the affected user(s)
  **after** their transaction commits, never from inside it — so a rolled-back transaction can
  never result in a false push.
- Frontend: `hooks/notifications/useNotificationStream.ts` opens the connection and, on each
  event, invalidates the notifications query and shows a toast;
  `components/common/NotificationStreamListener.tsx` (mounted once in `app/layout.tsx`) keeps it
  open for the session.

Known tradeoff: the access token travels in the SSE URL (query string) rather than a header. If
the browser has to reconnect after that token expires, the reconnect will 401 (a fresh page load
opens a new, valid connection) — the already-open connection itself is unaffected, since the
token is only checked once, at connect time.

## Known Limitations (backend, inherited as-is)

- Payments are simulated — always resolve to `SUCCESS`, no real gateway.
- Distance/duration/fare are Haversine + a fixed rate card, not a real routing/maps API.
- Notifications are real-time (SSE, see above); ride *status* changes are still pull-based — after
  a mutation, the frontend invalidates and refetches rather than receiving a push update for every
  status transition. Extending SSE (or moving to Socket.IO) to ride status is a future step.
- Refresh tokens are stateless JWTs (not tracked server-side), so `logout` is client-side only.
- Driver documents are URLs, not uploaded files (no Cloudinary/S3 in this phase).

## Future Improvements

- Socket.IO for live ride status / driver location without polling
- A real map for pickup/destination selection
- URL-persisted filters for every admin table (currently done for local component state; only
  the pattern itself needs extending)
- Real payment gateway integration behind the existing `PaymentPanel` component boundary
