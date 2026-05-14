# Sabi Web Implementation Guide

This document is the frontend contract for `apps/web`. It reflects the current Express API in `apps/api`, not the older high-level README examples.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/Radix UI components
- `lucide-react` for icons

Before changing Next.js conventions, read `node_modules/next/dist/docs/` as required by `AGENTS.md`.

## Environment

Create `apps/web/.env.local`:

```env
BACKEND_API_URL=https://sabi-api.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Sabi
```

The browser never calls the deployed backend directly. Frontend code calls local Next.js API routes under `/api/*`, and those routes proxy to `BACKEND_API_URL`.

```env
BACKEND_API_URL=http://localhost:5000/api/v1
```

## API Response Contract

Every JSON API response follows one of these shapes:

```ts
type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
};

type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]> | null;
};
```

Frontend rules:

- Treat `success: false` as an application error even if `fetch` resolves.
- Show `message` as the primary error text.
- For validation errors, display field errors from `errors`.
- Protected routes require `Authorization: Bearer <accessToken>`.
- Store `accessToken`, `refreshToken`, and `user` after register/login.
- If a protected request returns `401`, call `POST /auth/refresh` once with the refresh token, retry the original request, then logout if refresh fails.

Recommended client helper:

```ts
import { apiDownload, apiFetch, apiFetchWithRefresh, apiRoutes } from "@/lib/api";
```

## API Folder

Create a dedicated API layer in `apps/web/lib/api` so every screen uses the same request logic, route builders, and response types.

Suggested structure:

```txt
lib/api/
  client.ts
  index.ts
  routes.ts
  types.ts
```

Use this folder for:

- Central route strings.
- Query-string building.
- Auth header injection.
- Token refresh retry.
- Blob downloads.
- Strongly typed request and response helpers.

The route handlers themselves should live in `app/api/[...path]/route.ts` and `app/api/route.ts`, both of which should delegate to a shared proxy helper in `lib/api/proxy.ts`.

Example import pattern:

```ts
import { apiRoutes, apiFetch } from "@/lib/api";
```

Do not scatter raw `fetch` calls across components unless a screen is doing one-off work that will never be reused.

Client helpers should call `/api/...` only. They should not know or care about `BACKEND_API_URL`.

### `lib/api/routes.ts`

Keep backend endpoints in one place.

```ts
export const apiRoutes = {
  health: "/health",
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  users: {
    list: "/users",
    byId: (id: string) => `/users/${id}`,
    meProfile: "/users/me/profile",
    me: "/users/me",
    meEconomicProfile: "/users/me/economic-profile",
    meFinancialReport: "/users/me/financial-report.pdf",
  },
  onboard: {
    chat: "/onboard/chat",
    complete: "/onboard/complete",
  },
  buyerRequests: {
    analyse: "/buyer-requests/analyse",
    list: "/buyer-requests",
  },
  gigs: {
    browse: "/gigs/browse",
    recommended: "/gigs/recommended",
    myApplications: "/gigs/my-applications",
    apply: (opportunityId: string) => `/gigs/${opportunityId}/apply`,
    applications: (opportunityId: string) => `/gigs/${opportunityId}/applications`,
    hireApplicant: (applicationId: string) => `/gigs/applications/${applicationId}/hire`,
    completeApplication: (applicationId: string) => `/gigs/applications/${applicationId}/complete`,
  },
  matches: {
    generate: "/matches/generate",
    list: "/matches",
    status: (id: string) => `/matches/${id}/status`,
  },
  payments: {
    initiate: "/payments/initiate",
    verify: (transactionRef: string) => `/payments/verify/${transactionRef}`,
    transactions: "/payments/transactions",
    wallet: "/payments/wallet",
    escrows: "/payments/escrow",
    startEscrow: (escrowId: string) => `/payments/escrow/${escrowId}/start`,
    releaseEscrow: (escrowId: string) => `/payments/escrow/${escrowId}/release`,
    refundEscrow: (escrowId: string) => `/payments/escrow/${escrowId}/refund`,
  },
  trust: {
    me: "/trust/me",
    recalculateMe: "/trust/me/recalculate",
    byUserId: (userId: string) => `/trust/${userId}`,
  },
  trustScore: {
    me: "/trust-score/me",
    recalculateMe: "/trust-score/me/recalculate",
    byUserId: (userId: string) => `/trust-score/${userId}`,
  },
  vouches: {
    create: "/vouches",
    remove: (id: string) => `/vouches/${id}`,
    mineReceived: "/vouches/me/received",
    mineGiven: "/vouches/me/given",
    byUserId: (userId: string) => `/vouches/users/${userId}/received`,
  },
  export: {
    financialReport: "/export/financial-report",
    financialReportPdf: "/export/financial-report.pdf",
  },
} as const;
```

### `lib/api/client.ts`

Keep all request behavior in one client.

```ts
import { apiDownload, apiFetch, apiFetchWithRefresh, apiRoutes } from "@/lib/api";
```

### `lib/api/types.ts`

Keep the types close to the backend payloads. This is the minimum set the frontend needs to avoid `any` in the first pass.

```ts
export type UserType = "TRADER" | "SEEKER" | "BUYER";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  trustScore: number;
  profileImage: string | null;
};

export type EconomicProfile = {
  tradeCategory: string;
  skills: string[];
  description: string;
  yearsExperience: number;
  location: string | null;
  language: string;
};

export type AuthData = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
```

### `lib/api/index.ts`

Export route builders and shared helpers from one place.

```ts
export * from "./routes";
export * from "./types";
export { apiFetch, apiFetchWithRefresh, apiDownload } from "./client";
```

## Core Types

```ts
type UserType = "TRADER" | "SEEKER" | "BUYER";
type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  status: UserStatus;
  trustScore: number;
  profileImage: string | null;
  economicProfile?: EconomicProfile | null;
};

type EconomicProfile = {
  id?: string;
  userId?: string;
  tradeCategory: string;
  skills: string[];
  location: string;
  language: string;
  yearsExperience: number;
  description: string;
};

type AuthData = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
```

## Demo Accounts

After running `pnpm.cmd seed:profiles` in `apps/api`, every demo user uses:

```txt
Password123!
```

Useful accounts:

| Role | Email |
| --- | --- |
| TRADER | `amina.trader@sabi.local` |
| TRADER | `tunde.fashion@sabi.local` |
| SEEKER | `chinedu.seeker@sabi.local` |
| SEEKER | `grace.catering@sabi.local` |
| BUYER | `fatima.buyer@sabi.local` |
| BUYER | `ibrahim.logistics@sabi.local` |

## Auth Flow

### Register

`POST /auth/register`

```json
{
  "fullName": "Amaka Okafor",
  "email": "amaka@example.com",
  "phone": "08012345678",
  "password": "Password123!",
  "userType": "TRADER"
}
```

Phone numbers must match Nigerian formats like `08012345678` or `+2348012345678`.

Successful response data:

```ts
AuthData
```

Registration starts Squad virtual account creation asynchronously. The user may login immediately, but wallet/account data can appear after the backend finishes account creation.

### Login

`POST /auth/login`

```json
{
  "email": "amina.trader@sabi.local",
  "password": "Password123!"
}
```

Persist:

- `data.accessToken`
- `data.refreshToken`
- `data.user`

### Current User

`GET /auth/me`

Use this on app boot when a token exists.

## Main App Routes To Build

Recommended first screens:

- `/login`
- `/register`
- `/dashboard`
- `/onboarding` for `TRADER` and `SEEKER`
- `/buyer/request` for `BUYER`
- `/matches`
- `/gigs`
- `/wallet`
- `/profile/[userId]`
- `/trust/[userId]`

Use role-based navigation:

- `TRADER`: dashboard, onboarding/profile, wallet, escrow, vouches, trust score.
- `SEEKER`: onboarding/profile, gigs, matches, applications, wallet, trust score.
- `BUYER`: buyer request flow, matched traders, escrow, wallet, trust score.

## Onboarding Flow

Only `TRADER` and `SEEKER` users can use onboarding. `BUYER` users should be sent to buyer requests.

### Chat

`POST /onboard/chat`

```json
{
  "message": "I sell fabrics in Balogun market and have worked for 5 years.",
  "history": [
    { "role": "user", "content": "I sell fabrics in Balogun market." },
    { "role": "assistant", "content": "What skills should I add to your profile?" }
  ]
}
```

Response data:

```ts
type OnboardingChatData = {
  reply: string;
  isComplete: boolean;
  extractedData: EconomicProfile | null;
};
```

Frontend behavior:

- Render `reply` as the assistant message.
- Keep local `history` as `{ role, content }[]`.
- When `isComplete` is `true` and `extractedData` is present, show a review screen.
- Let the user edit fields before saving.

### Complete

`POST /onboard/complete`

Send either the raw profile object or wrap it as `extractedData`. Prefer the wrapper:

```json
{
  "extractedData": {
    "tradeCategory": "Fabric Trading",
    "skills": ["fabric sourcing", "customer negotiation"],
    "location": "Balogun Market, Lagos",
    "language": "English, Yoruba",
    "yearsExperience": 5,
    "description": "I sell fabrics and help customers source materials."
  }
}
```

On success, route to `/dashboard` and refresh `/users/me/profile`.

## Buyer Request Flow

Only `BUYER` users can use these routes.

### Create or Analyse Buyer Request

`POST /buyer-requests` or `POST /buyer-requests/analyse`

Text-only body:

```json
{
  "description": "I need a tailor to sew 8 native wear outfits before Friday. Budget is 64000."
}
```

Image body:

```json
{
  "description": "Find someone who can make this outfit.",
  "imageBase64": "<base64 without data URL prefix>",
  "mimeType": "image/jpeg"
}
```

Response data includes:

- `request`
- `extractedNeed`
- `matches`

Use `matches[].traderId` to fetch public profiles with `GET /users/{id}` if the UI needs full trader cards.

### List My Buyer Requests

`GET /buyer-requests`

Use this for buyer request history.

## Users and Profiles

### Own Full Profile

`GET /users/me/profile`

Use this for dashboard/profile settings.

### Update Own User Profile

`PATCH /users/me`

```json
{
  "fullName": "Amina Bello",
  "phone": "08010000001",
  "profileImage": "https://example.com/avatar.jpg"
}
```

### Update Own Economic Profile

`PATCH /users/me/economic-profile`

```json
{
  "tradeCategory": "Fashion Design",
  "skills": ["tailoring", "alterations"],
  "description": "I sew native wear and handle alterations.",
  "yearsExperience": 9,
  "location": "Surulere, Lagos",
  "language": "English, Yoruba"
}
```

### Public Profile

`GET /users/{id}`

No auth required.

## Gigs and Applications

All gig routes are protected.

### Browse Gigs

`GET /gigs/browse?category=Fashion&location=Lagos&minBudget=10000&maxBudget=80000&page=1&limit=10`

Response data:

```ts
{
  gigs: Array<Record<string, unknown> & { hasApplied: boolean }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Recommended Gigs

`GET /gigs/recommended`

Requires the current user to have an economic profile.

### Apply To Gig

`POST /gigs/{opportunityId}/apply`

```json
{
  "coverNote": "I can handle this job and deliver by Friday."
}
```

### My Applications

`GET /gigs/my-applications?page=1&limit=10`

### Poster Views Applicants

`GET /gigs/{opportunityId}/applications`

### Hire Applicant

`PATCH /gigs/applications/{applicationId}/hire`

Response includes a Squad checkout URL. Open or redirect the user to `data.checkoutUrl`.

### Mark Application Complete

`PATCH /gigs/applications/{applicationId}/complete`

Only the hired seeker can mark the hired application complete.

Important backend gap: there is no current frontend-facing route to create opportunities/gigs. The seed creates demo gigs, and browse/apply/hire flows exist.

## Matches

All match routes are protected.

### Generate Matches

`POST /matches/generate`

```json
{
  "limit": 20,
  "minScore": 50
}
```

### List Matches

`GET /matches`

### Update Match Status

`PATCH /matches/{id}/status`

```json
{
  "status": "ACCEPTED"
}
```

Allowed status values:

- `PENDING`
- `ACCEPTED`
- `REJECTED`

## Wallet, Payments, and Escrow

All payment routes are protected.

### Wallet

`GET /payments/wallet`

Response data:

```ts
{
  account: {
    id: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    balance: string | number;
  };
  balances: {
    available: number;
    escrowHeld: number;
    pendingEarnings: number;
  };
}
```

If this returns `404`, show a message that the user needs a wallet/account. For locally seeded accounts this should be present.

### Initiate Squad Checkout

`POST /payments/initiate`

Amount is in kobo and must be at least `10000` (`NGN 100`).

```json
{
  "amount": 500000,
  "customerName": "Fatima Musa",
  "customerEmail": "fatima.buyer@sabi.local",
  "callbackUrl": "http://localhost:3000/payment/callback"
}
```

Response data includes `checkoutUrl` and `transactionRef`.

### Verify Transaction

`GET /payments/verify/{transactionRef}`

### Transactions

`GET /payments/transactions?page=1&perPage=20`

### Create Escrow

Only `BUYER` users can fund escrow.

`POST /payments/escrow`

```json
{
  "traderId": "uuid-of-trader",
  "amount": 20000,
  "description": "Payment for rice supply",
  "metadata": {
    "source": "web"
  }
}
```

Amount is in naira units for this escrow route, not kobo.

### List Escrows

`GET /payments/escrow`

Optional filters:

- `GET /payments/escrow?role=buyer`
- `GET /payments/escrow?role=trader`

### Escrow Actions

- Trader starts job: `PATCH /payments/escrow/{escrowId}/start`
- Buyer releases funds: `PATCH /payments/escrow/{escrowId}/release`
- Buyer refunds funds: `PATCH /payments/escrow/{escrowId}/refund`

Use status-based buttons:

- `FUNDED`: trader can start, buyer can release or refund.
- `IN_PROGRESS`: buyer can release.
- `COMPLETED`: no action.
- `REFUNDED`: no action.

## Trust and Vouching

### Trust Score

Public:

- `GET /trust/{userId}`
- `GET /trust-score/{userId}`

Protected current-user routes:

- `GET /trust/me`
- `POST /trust/me/recalculate`
- `GET /trust-score/me`
- `POST /trust-score/me/recalculate`

Response data includes:

```ts
{
  total: number;
  transactionScore: number;
  ratingScore: number;
  tenureScore: number;
  vouchingScore: number;
  profileScore: number;
}
```

### Vouches

Create vouch:

`POST /vouches`

```json
{
  "voucheeId": "uuid-of-user",
  "message": "Reliable supplier and clear communicator."
}
```

Lists:

- `GET /vouches/me/received`
- `GET /vouches/me/given`
- `GET /vouches/users/{userId}/received`

Delete:

- `DELETE /vouches/{id}`

## PDF Export

Protected routes:

- `GET /export/financial-report`
- `GET /export/financial-report.pdf`
- `GET /users/me/financial-report.pdf`

Fetch as a blob, not JSON:

```ts
async function downloadFinancialReport() {
  return apiDownload("/export/financial-report.pdf");
}
```

## Current Backend Gaps

Do not build UI that depends on these unless the backend is added first:

- Public `/pay/:username` payment page API support.
- Opportunity/gig creation and management routes.
- Ratings create/list routes.
- Notifications routes.
- Settings/change password/privacy/delete account routes.
- Application shortlist endpoint.
- Poster delivery confirmation endpoint separate from current seeker completion.

For hackathon/demo flow, use the seeded users, seeded gigs, buyer request matching, wallet, escrow, trust score, and vouch flows.

## Implementation Order

1. Add typed API client with token injection, refresh retry, and validation-error handling.
2. Build auth pages and persist auth state.
3. Add role-aware dashboard shell and navigation.
4. Build onboarding chat and review/save flow for `TRADER` and `SEEKER`.
5. Build buyer request create/results/history flow for `BUYER`.
6. Build wallet and escrow screens.
7. Build gigs browse/apply/applications screens around existing seeded gigs.
8. Build matches, trust score, vouches, and public profile screens.
9. Add PDF report download.

## Verification Checklist

- Login works with each seeded user.
- Refresh-token retry works after a forced `401`.
- `TRADER` and `SEEKER` can complete onboarding and update profile data.
- `BUYER` is blocked from onboarding and can create buyer requests.
- Buyer request results show matched trader cards.
- Wallet loads account number and balances.
- Buyer can create escrow using a trader ID.
- Trader can start escrow, buyer can release or refund it.
- Trust score and vouches render for current and public users.
- PDF export downloads as a file.
