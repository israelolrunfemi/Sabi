<div align="center">

# SABI

### Intelligent Informal Economy Platform

*"To know" — Nigerian Pidgin*

AI-powered platform that digitally onboards Nigeria's informal economy — connecting traders, artisans, and job seekers to opportunities and financial access via Squad payments.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io/)
[![Squad](https://img.shields.io/badge/Squad-API-FF6B35?style=flat-square)](https://squadco.com/)
[![Claude AI](https://img.shields.io/badge/Claude-AI-D97757?style=flat-square)](https://anthropic.com/)

---

Built for **Squad Hackathon 3.0** — Challenge 02: Smart Systems, The Intelligent Economy

</div>

---

## The Problem

Nigeria has **40 million+ informal economy workers** — traders, artisans, gig workers — who contribute an estimated **57% of GDP** but remain financially invisible to banks, lenders, and formal employers.

Not because they lack hustle. Because they lack infrastructure.

- No payslip → no loan
- No digital presence → no buyers beyond their street
- No credit history → no formal financial services
- No discoverable skill record → no formal job opportunities

**Sabi fixes the infrastructure, not the people.**

---

## The Solution

Sabi is a three-layer platform:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1 — ONBOARDING & IDENTITY                        │
│  Conversational AI creates a verified economic profile  │
│  + Squad virtual account on sign-up                     │
├─────────────────────────────────────────────────────────┤
│  LAYER 2 — MATCHING ENGINE                              │
│  Claude AI matches job seekers to opportunities         │
│  and traders to buyers — contextually, not by keyword   │
├─────────────────────────────────────────────────────────┤
│  LAYER 3 — FINANCIAL ACCESS                             │
│  Trust score built from real Squad transaction data.    │
│  Alternative credit identity for the invisible worker.  │
└─────────────────────────────────────────────────────────┘
```

---

## Demo Flow

> **Amaka** sells fabric in Balogun Market. She has been in business for 11 years. She has never had a bank loan.

1. Amaka opens Sabi and chats with the AI onboarding agent
2. The agent extracts her trade category, skills, location, and business context in plain conversation
3. A Squad virtual account is created — her first digital financial identity
4. She generates a payment link and shares it with a buyer in Abuja
5. The transaction completes via Squad and adds to her trust score
6. A supply manager in Lekki searches for verified fabric suppliers — Sabi surfaces Amaka with a **Trust Score of 78/100**
7. After 6 weeks of consistent transactions, Amaka qualifies for a micro-loan based on her Sabi financial history

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Onboarding Agent** | Claude-powered conversational onboarding. Extracts economic profile from natural language — no forms. |
| **Squad Virtual Accounts** | Every user gets a Squad virtual account on signup. Their financial identity starts here. |
| **AI Match Engine** | Ranks job/trade matches by skill overlap, location, language, and experience fit — not just keywords. |
| **Trust Score** | Calculated from transaction frequency, completion rate, peer ratings, tenure, and vouching. 0–100. |
| **Payment Links** | Traders generate shareable Squad payment links from their dashboard in one click. |
| **Transaction History** | Full Squad transaction log powers the credit profile. Every payment builds the score. |
| **Peer Vouching** | Existing verified users vouch for new users. Social trust becomes a digital credit signal. |
| **Micro-Certification** | 10 verified jobs + 4+ star rating = a verifiable skill badge on the public profile. |

---

## Tech Stack

### Frontend — `apps/web`
| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Server State | TanStack Query |
| Forms | React Hook Form + Zod |
| Package Manager | pnpm |

### Backend — `apps/api`
| | |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express |
| Language | TypeScript 5 |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | Zod |
| Logging | Winston |
| Package Manager | pnpm |

### External Services
| | |
|---|---|
| Payments | Squad API (virtual accounts, payment links, transfers, webhooks) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| File Storage | Cloudinary |
| Auth | JWT (access + refresh token pattern) |

---

## Project Structure

```
sabi/
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── app/                    # App Router pages
│   │   ├── Components/             # PascalCase — React components
│   │   │   ├── UI/                 # Shared UI wrappers (shadcn extensions)
│   │   │   ├── Dashboard/
│   │   │   ├── Onboarding/
│   │   │   └── Matches/
│   │   ├── Hooks/                  # useUserProfile.ts, useTrustScore.ts
│   │   ├── Types/                  # TypeScript types (frontend)
│   │   ├── lib/                    # ApiClient.ts, utils.ts
│   │   └── public/
│   │
│   └── api/                        # Express backend
│       └── src/
│           ├── controllers/        # user.controller.ts
│           ├── services/           # user.service.ts, squad.service.ts
│           ├── models/             # user.model.ts (TS types only)
│           ├── routes/             # user.routes.ts
│           ├── middlewares/        # auth.middleware.ts, error.middleware.ts
│           ├── validators/         # user.validator.ts (Zod schemas)
│           ├── utils/              # app.error.ts, api.response.ts
│           ├── config/             # cors.config.ts, logger.config.ts
│           ├── prisma/             # client.ts
│           └── index.ts
│
├── CONTRIBUTING.md                 # Developer guidelines (read before coding)
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+ — `npm install -g pnpm`
- PostgreSQL 15+
- A [Squad sandbox account](https://sandbox.squadco.com)
- An [Anthropic API key](https://console.anthropic.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-org/sabi.git
cd sabi
```

---

### 2. Set up the Backend

```bash
cd apps/api
pnpm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```bash
# .env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/sabi_dev

JWT_SECRET=your_minimum_32_character_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_different_minimum_32_character_secret
JWT_REFRESH_EXPIRES_IN=7d

SQUAD_API_KEY=sandbox_sk_xxxxxxxxxxxxxxxxxxxx
SQUAD_BASE_URL=https://sandbox-api-d.squadco.com
SQUAD_WEBHOOK_SECRET=your_squad_webhook_secret

ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_MAX_TOKENS=1000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ALLOWED_ORIGIN_DEV=http://localhost:3000
ALLOWED_ORIGIN_PROD=https://sabi.vercel.app

LOG_LEVEL=debug
```

Run database migrations and seed demo data:

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

Start the backend:

```bash
pnpm dev
# API running on http://localhost:5000
```

---

### 3. Set up the Frontend

```bash
cd apps/web
pnpm install
```

```bash
cp .env.example .env.local
```

```bash
# .env.local
NEXT_PUBLIC_APP_NAME=Sabi
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENABLE_VOUCHING=false
NEXT_PUBLIC_ENABLE_DIASPORA=false
```

Start the frontend:

```bash
pnpm dev
# App running on http://localhost:3000
```

---

## API Overview

All responses follow a consistent shape:

```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": { }
}
```

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login, returns tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/onboard/chat` | Send message to AI onboarding agent |
| `POST` | `/api/onboard/complete` | Finalize profile, create Squad account |
| `GET` | `/api/users/:id` | Get user public profile |
| `PATCH` | `/api/users/:id/profile` | Update economic profile |
| `GET` | `/api/matches` | Get AI-ranked matches for current user |
| `POST` | `/api/matches/:id/respond` | Accept or reject a match |
| `GET` | `/api/opportunities` | List open opportunities |
| `POST` | `/api/opportunities` | Post a new opportunity |
| `POST` | `/api/payments/link` | Generate Squad payment link |
| `GET` | `/api/payments/transactions` | Get transaction history |
| `POST` | `/api/webhooks/squad` | Squad payment event webhook |
| `GET` | `/api/trust/:userId` | Get trust score breakdown |
| `POST` | `/api/ratings` | Submit post-transaction rating |

Full API collection available in `/postman/Sabi.postman_collection.json`

---

## Squad API Integration

Squad is central to Sabi — not a bolted-on payment option.

| Squad Feature | How Sabi Uses It |
|--------------|-----------------|
| Virtual Accounts | Created for every user on onboarding. The foundation of their financial identity. |
| Payment Links | Traders generate shareable links from their dashboard. Any buyer can pay instantly. |
| Transaction History | Fetched per user and fed into the Trust Score engine. Every payment builds credit. |
| Transfers | Matched gig payments and escrow releases disbursed via Squad. |
| Webhooks | Real-time payment events trigger trust score recalculation automatically. |

> **Switching to production:** Set `SQUAD_API_KEY` to your live key and `SQUAD_BASE_URL` to `https://api-d.squadco.com`

---

## Trust Score

Every user has a Trust Score from 0–100. It updates automatically as they transact.

```
Transaction Score   35 pts   Frequency × completion rate
Rating Score        25 pts   Average of all received ratings
Tenure Score        20 pts   5 pts/month on platform, capped at 4 months
Vouching Score      15 pts   5 pts per verified vouch (max 3)
Profile Score        5 pts   Full profile + photo
─────────────────────────────
Total               100 pts
```

New users start at **40/100**. A score above **75** unlocks elite visibility in search results.

---

## AI Layer

### Onboarding Agent
- Model: `claude-sonnet-4-20250514`
- Multi-turn conversation extracts: user type, trade category, skills, location, language, years of experience
- Outputs structured JSON to populate the economic profile
- Gracefully handles off-topic responses and redirects

### Matching Engine
- Receives seeker profile + up to 20 open opportunities
- Returns ranked matches with a 0–100 compatibility score and plain-language reasoning
- Weighted scoring: skill overlap (40%), location (25%), experience fit (20%), language (15%)
- Results cached for 6 hours per user

---

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Frontend files | PascalCase | `TrustScoreCard.tsx` |
| Backend files | dot.notation | `user.controller.ts` |
| Variables & functions | camelCase | `getUserProfile()` |
| Classes, Types, Interfaces | PascalCase | `AppError`, `UserProfile` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_TRUST_SCORE` |
| DB models | PascalCase | `model UserProfile {}` |
| DB fields | snake_case | `trust_score`, `created_at` |
| API routes | kebab-case | `/api/trust-score/:id` |

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full developer guidelines.

---

## Git Workflow

```bash
# Always branch from dev
git checkout dev
git pull origin dev
git checkout -b feat/your-feature-name

# Commit format
git commit -m "feat(onboarding): add AI session management"
git commit -m "fix(squad): handle virtual account timeout"
git commit -m "chore(prisma): add trust score migration"

# PR targets dev — never main
```

**Branch types:** `feat/` `fix/` `chore/` `hotfix/` `docs/`

---

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | Vercel | Auto-deploy from `main` |
| Backend | Railway | Auto-deploy from `main` |
| Database | Railway PostgreSQL | Managed instance |
| Files | Cloudinary | Free tier |

---

## The Team

| Role | Responsibilities |
|------|----------------|
| **Backend Dev** | Express API, Prisma schema, Squad integration, Claude AI layer, deployment |
| **Frontend Dev** | Next.js app, UI components, TanStack Query, Vercel deployment |
| **Designer** | Figma screens, component system, pitch deck, one-pager |

---

## Roadmap (Post-Hackathon)

- [ ] WhatsApp & USSD onboarding channel
- [ ] Group/cooperative onboarding for market associations
- [ ] B2B procurement layer for formal businesses sourcing from informal suppliers
- [ ] Diaspora dashboard — fund and monitor family trade wallets remotely
- [ ] Dispute resolution with community mediation panel
- [ ] Economic intelligence API for government and NGO partners

---

## Acknowledgements

Built on [Squad](https://squadco.com/) payment infrastructure and [Anthropic Claude](https://anthropic.com/) AI — two platforms that made the intelligence and financial layers of this product possible.

---

<div align="center">

**Squad Hackathon 3.0 — Challenge 02**

*Built in 7 days. For 40 million people who were building every day long before we started.*

</div>
