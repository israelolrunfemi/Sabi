# Sabi API

Sabi is an intelligent informal economy platform for onboarding Nigeria's informal workers, matching them to opportunities, and turning their economic activity into financial identity.

This repository is the Express + TypeScript backend for the hackathon build. It exposes authentication, AI onboarding, buyer request matching, gig flows, Squad payment hooks, trust scoring, vouching, and PDF financial report export.

## Product Scope

Sabi supports three user types:

- `TRADER`: market traders and small business owners who need a digital profile, payments, trust score, and financial report.
- `SEEKER`: artisans, gig workers, and job seekers who need matched gigs, reputation, and verified income history.
- `BUYER`: people or businesses looking for trusted traders or service providers.

Core product layers:

- Onboarding and identity: AI chat extracts an economic profile and saves it to the database.
- Matching engine: AI ranks gigs, applicants, and buyer service requests.
- Financial access: Squad transactions, trust score, vouching, and PDF reports create financial identity.

## Current Backend Status

Implemented:

- Auth register, login, refresh, and current user.
- User profile, economic profile, and public profile.
- AI onboarding chat and onboarding completion.
- Buyer request matching by typed description, optional image upload, or both.
- Gig browsing, recommendations, applications, applicant ranking, hiring, and seeker completion.
- AI match generation, listing, and status updates.
- Squad payment initiation, verification, wallet lookup, transaction history, and webhook handling.
- Trust score calculation and recalculation.
- Vouch creation, listing, and deletion.
- Financial Identity Report PDF export.
- Swagger/OpenAPI docs.
- Sample profile seed data for local testing.

Not implemented yet:

- `/opportunities` CRUD routes for creating and managing posted gigs directly.
- `/ratings` routes.
- Application shortlisting endpoint.
- Poster delivery confirmation and real Squad escrow release.
- Notifications endpoints.
- Settings, change password, privacy, and delete account endpoints.
- Public `/pay/:username` payment page API support.

## Tech Stack

- Node.js
- Express
- TypeScript
- Sequelize
- PostgreSQL
- Zod
- Gemini API
- Squad API
- Cloudinary for optional buyer request image storage
- PDFKit

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create `.env` with the required values:

```env
NODE_ENV=development
PORT=5000
API_VERSION=v1

DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME

JWT_SECRET=change-me
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me-too
JWT_REFRESH_EXPIRES_IN=7d

SQUAD_API_KEY=your-squad-key
SQUAD_BASE_URL=https://sandbox-api-d.squadco.com
SQUAD_WEBHOOK_SECRET=your-squad-webhook-secret
SQUAD_BENEFICIARY_ACCOUNT=0123456789

GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-3.1-flash-lite

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

LOG_LEVEL=debug
NGROK_AUTHTOKEN=
CLIENT_BASE_URL=http://localhost:3000
```

Run the API in development:

```bash
pnpm.cmd run dev
```

Build the API:

```bash
pnpm.cmd run build
```

Start compiled output:

```bash
pnpm.cmd run start
```

The default local base URL is:

```text
http://localhost:5000/api/v1
```

## API Docs

Swagger UI:

```text
http://localhost:5000/api/v1/docs
```

OpenAPI JSON:

```text
http://localhost:5000/api/v1/docs/openapi.json
```

Swagger UI loads assets from a CDN. The OpenAPI JSON endpoint is local and can be imported into Postman.

## Authentication

Protected routes require:

```http
Authorization: Bearer <accessToken>
```

Use `POST /auth/register` or `POST /auth/login` to get `accessToken` and `refreshToken`.

Example register body:

```json
{
  "fullName": "Amaka Okafor",
  "email": "amaka@example.com",
  "phone": "08012345678",
  "password": "Password123!",
  "userType": "TRADER"
}
```

## Key Endpoints

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

Users:

- `GET /users/:id`
- `GET /users/me/profile`
- `PATCH /users/me`
- `PATCH /users/me/economic-profile`
- `GET /users`

Onboarding:

- `POST /onboard/chat`
- `POST /onboard/complete`

Buyer requests:

- `POST /buyer-requests/analyse`
- `POST /buyer-requests`
- `GET /buyer-requests`

Gigs:

- `GET /gigs/browse`
- `GET /gigs/recommended`
- `GET /gigs/my-applications`
- `POST /gigs/:opportunityId/apply`
- `GET /gigs/:opportunityId/applications`
- `PATCH /gigs/applications/:applicationId/hire`
- `PATCH /gigs/applications/:applicationId/complete`

Matches:

- `POST /matches/generate`
- `GET /matches`
- `PATCH /matches/:id/status`

Payments:

- `POST /payments/initiate`
- `GET /payments/verify/:transactionRef`
- `GET /payments/transactions`
- `GET /payments/wallet`
- `POST /webhooks/squad`

Trust and vouching:

- `GET /trust/me`
- `POST /trust/me/recalculate`
- `GET /trust/:userId`
- `POST /vouches`
- `GET /vouches/me/received`
- `GET /vouches/me/given`
- `GET /vouches/users/:userId/received`
- `DELETE /vouches/:id`

Export:

- `GET /export/financial-report`
- `GET /users/me/financial-report.pdf`

## Buyer Request Matching

Buyers can type what they are looking for without uploading an image:

```json
{
  "description": "I need a tailor to sew an ankara dress with puff sleeves"
}
```

Image upload is optional:

```json
{
  "description": "Something like this but in blue",
  "imageBase64": "base64-image-data",
  "mimeType": "image/jpeg"
}
```

Validation requires either `description` or `imageBase64` plus `mimeType`.

## Seed Data

Seed sample users and economic profiles:

```bash
pnpm.cmd run seed:profiles
```

Shared password for seeded users:

```text
Password123!
```

Seeded accounts:

- `amina.trader@sabi.local` - `TRADER`
- `chinedu.seeker@sabi.local` - `SEEKER`
- `fatima.buyer@sabi.local` - `BUYER`
- `tunde.fashion@sabi.local` - `TRADER`
- `grace.catering@sabi.local` - `SEEKER`
- `ibrahim.logistics@sabi.local` - `BUYER`

## Notes

- CORS is intentionally not mounted in this API.
- Registration currently attempts Squad virtual account creation in the background. If Squad fails, registration still succeeds.
- `sequelize.sync()` runs on server start. Use migrations for production schema changes.
- Most response bodies follow `{ success, message, data, meta? }`.
