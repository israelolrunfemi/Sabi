# Sabi — Developer Guidelines

> This document is the single source of truth for how we build. Every team member reads this before writing a single line of code. No exceptions.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Tech Stack](#2-tech-stack)
3. [Naming Conventions](#3-naming-conventions)
4. [Frontend Guidelines](#4-frontend-guidelines)
5. [Backend Guidelines](#5-backend-guidelines)
6. [CORS Configuration](#6-cors-configuration)
7. [Environment Variables](#7-environment-variables)
8. [Git Workflow](#8-git-workflow)
9. [Code Quality Standards](#9-code-quality-standards)
10. [API Response Standards](#10-api-response-standards)
11. [Error Handling](#11-error-handling)
12. [Folder Structure](#12-folder-structure)

---

## 1. Project Structure

This is a monorepo with two separate workspaces.

```
sabi/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── .gitignore
├── README.md
└── CONTRIBUTING.md   # This file
```

Each app manages its own `package.json`, `node_modules`, and `.env`. Never mix frontend and backend dependencies.

---

## 2. Tech Stack

### Frontend (`apps/web`)
| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 14+ (App Router) | Framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| shadcn/ui | Latest | Component library |
| TanStack Query | 5+ | Server state & caching |
| React Hook Form | 7+ | Form management |
| Zod | 3+ | Schema validation |
| pnpm | 8+ | Package manager |

### Backend (`apps/api`)
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ LTS | Runtime |
| Express | 4+ | HTTP framework |
| TypeScript | 5+ | Type safety |
| Prisma | 5+ | ORM |
| PostgreSQL | 15+ | Database |
| Zod | 3+ | Request validation |
| Winston | 3+ | Logging |
| pnpm | 8+ | Package manager |

> **Rule:** Always use `pnpm` — never `npm` or `yarn`. Running `npm install` in this project is a violation of this guideline.

---

## 3. Naming Conventions

### The Split Rule — Frontend vs Backend

Frontend and backend use **different** file naming conventions. Learn both and never mix them.

---

### Frontend Files — PascalCase

All frontend files use PascalCase — the component name and the filename must always match.

```
✅ TrustScoreCard.tsx
✅ OnboardingChat.tsx
✅ MatchCard.tsx
✅ UserDashboard.tsx
✅ ApiClient.ts
✅ UserTypes.ts

❌ trustScoreCard.tsx
❌ onboarding-chat.tsx
❌ match_card.tsx
❌ userDashboard.tsx
```

---

### Backend Files — dot.notation (resource.type.ts)

All backend files use lowercase dot-separated naming: `resource.type.ts`.

```
✅ user.controller.ts
✅ user.service.ts
✅ user.model.ts
✅ user.routes.ts
✅ user.validator.ts
✅ user.middleware.ts
✅ trust-score.service.ts
✅ squad-payment.service.ts
✅ app.error.ts
✅ api.response.ts
✅ cors.config.ts
✅ logger.config.ts

❌ UserController.ts
❌ userController.ts
❌ UserService.ts
❌ user_controller.ts
❌ usermodel.ts
```

**The types used as suffixes:**

| Suffix | Example | Purpose |
|--------|---------|---------|
| `.controller.ts` | `user.controller.ts` | HTTP handler — parse request, call service, return response |
| `.service.ts` | `user.service.ts` | Business logic and external API calls |
| `.model.ts` | `user.model.ts` | TypeScript types/interfaces for the resource |
| `.routes.ts` | `user.routes.ts` | Express router for the resource |
| `.validator.ts` | `user.validator.ts` | Zod schemas for request validation |
| `.middleware.ts` | `auth.middleware.ts` | Express middleware functions |
| `.config.ts` | `cors.config.ts` | App configuration |
| `.util.ts` | `jwt.util.ts` | Pure utility/helper functions |

> **Multi-word resources:** use kebab-case — `trust-score.service.ts`, `squad-payment.service.ts`, `onboard-chat.controller.ts`

### Variables & Functions — camelCase (both frontend & backend)
```ts
// ✅ Correct
const trustScore = 82;
const getUserProfile = async () => {};
const isVerified = true;

// ❌ Wrong
const TrustScore = 82;
const GetUserProfile = async () => {};
const IsVerified = true;
```

> **Note:** Frontend component event handlers also use camelCase — `handleViewBreakdown`, `handleSubmit`, not `HandleViewBreakdown`.

### Classes & Types & Interfaces — PascalCase
```ts
// ✅ Correct
class UserService {}
type ApiResponse = {}
interface UserProfile {}
enum UserType {}

// ❌ Wrong
class userService {}
type apiResponse = {}
interface userProfile {}
```

### Constants — SCREAMING_SNAKE_CASE
```ts
// ✅ Correct
const MAX_TRUST_SCORE = 100;
const SQUAD_BASE_URL = 'https://api-d.squadco.com';
const JWT_EXPIRY = '15m';

// ❌ Wrong
const maxTrustScore = 100;
const squadBaseUrl = 'https://api-d.squadco.com';
```

### Database (Prisma) — snake_case for fields, PascalCase for models
```prisma
// ✅ Correct
model UserProfile {
  id           String   @id @default(uuid())
  trust_score  Int      @default(40)
  created_at   DateTime @default(now())
  user_id      String
}

// ❌ Wrong
model userProfile {
  trustScore  Int
  createdAt   DateTime
}
```

### API Routes — kebab-case
```
✅ /api/trust-score/:userId
✅ /api/onboard/complete
✅ /api/payment-link

❌ /api/TrustScore/:userId
❌ /api/onboardComplete
❌ /api/PaymentLink
```

### React Components — PascalCase (filename AND component name must match)
```tsx
// File: TrustScoreCard.tsx
// ✅ Correct
export const TrustScoreCard = () => {
  return <div>...</div>;
};

// ❌ Wrong — filename is TrustScoreCard.tsx but export is different
export const trustscorecard = () => {};
export const trustScoreCard = () => {};
```

### Custom Hooks — camelCase prefixed with `use` (Frontend only)
```ts
// ✅ Correct — filename matches the hook name
useUserProfile.ts
useTrustScore.ts
useSquadPayment.ts

// ❌ Wrong
UseUserProfile.ts
user-profile.ts
getUserProfile.ts
```

---

## 4. Frontend Guidelines

### 4.1 — Tailwind CSS Rules

**Only use Tailwind utility classes. No inline styles. No CSS modules.**

```tsx
// ✅ Correct
<div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">

// ❌ Wrong
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
```

**Use the design token variables defined in `tailwind.config.ts`:**

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4332',
          light: '#40916C',
          pale: '#D8F3DC',
        },
        accent: '#E76F51',
        trust: '#F4A261',
        surface: '#F7FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
      },
    },
  },
};
```

**Use `cn()` utility for conditional classes — never string concatenation:**

```tsx
import { cn } from '@/lib/Utils';

// ✅ Correct
<div className={cn('rounded-card bg-white p-4', isActive && 'border-2 border-primary')}>

// ❌ Wrong
<div className={`rounded-card bg-white p-4 ${isActive ? 'border-2 border-primary' : ''}`}>
```

### 4.2 — shadcn/ui Rules

**Never modify shadcn component source files directly.** Wrap them instead:

```tsx
// ✅ Correct — create a wrapper
// File: Components/UI/TrustBadge.tsx
import { Badge } from '@/components/ui/badge';

export const TrustBadge = ({ score }: { score: number }) => {
  return (
    <Badge className={cn(
      'font-mono text-sm',
      score >= 80 && 'bg-primary text-white',
      score >= 50 && score < 80 && 'bg-trust text-black',
      score < 50 && 'bg-accent text-white',
    )}>
      {score}/100
    </Badge>
  );
};

// ❌ Wrong — editing the shadcn source file directly
// apps/web/components/ui/badge.tsx ← DO NOT TOUCH
```

**Install components via CLI only:**

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
```

### 4.3 — Component Structure

Every component file follows this exact order:

```tsx
// 1. Imports — external libraries first, internal second
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { TrustBadge } from '@/Components/UI/TrustBadge';
import { useUserProfile } from '@/Hooks/useUserProfile';
import type { UserProfile } from '@/Types/User';

// 2. Types & interfaces
interface TrustScoreCardProps {
  userId: string;
  showBreakdown?: boolean;
}

// 3. Component (named export, never default export for components)
export const TrustScoreCard = ({ userId, showBreakdown = false }: TrustScoreCardProps) => {
  // 4. Hooks first
  const { data, isLoading } = useUserProfile(userId);

  // 5. Derived state
  const scoreColor = data?.trustScore >= 80 ? 'text-primary' : 'text-trust';

  // 6. Handlers
  const HandleViewBreakdown = () => {};

  // 7. Early returns (loading, error, empty)
  if (isLoading) return <TrustScoreCardSkeleton />;
  if (!data) return null;

  // 8. Render
  return (
    <Card className="p-4">
      <span className={cn('font-mono text-4xl font-bold', scoreColor)}>
        {data.trustScore}
      </span>
    </Card>
  );
};

// 9. Skeleton (co-located with the component)
const TrustScoreCardSkeleton = () => (
  <Card className="h-32 animate-pulse bg-surface" />
);
```

### 4.4 — Data Fetching Rules

**All API calls go through a central `ApiClient` — never raw `fetch` in components:**

```ts
// File: lib/ApiClient.ts
const ApiClient = {
  get: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

export default ApiClient;
```

**Use TanStack Query for all data fetching:**

```tsx
// File: Hooks/useUserProfile.ts
import { useQuery } from '@tanstack/react-query';
import ApiClient from '@/lib/ApiClient';

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => ApiClient.get(`/users/${userId}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

### 4.5 — Form Rules

**All forms use React Hook Form + Zod. No uncontrolled forms:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const OnboardingSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  tradeCategory: z.string().min(1, 'Please select a trade category'),
});

type OnboardingFormData = z.infer<typeof OnboardingSchema>;

export const OnboardingForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingFormData>({
    resolver: zodResolver(OnboardingSchema),
  });

  const OnSubmit = (data: OnboardingFormData) => {
    // handle submit
  };

  return (
    <form onSubmit={handleSubmit(OnSubmit)}>
      {/* Always show label ABOVE input */}
      <label className="text-sm font-medium text-gray-700">Full Name</label>
      <input {...register('fullName')} />
      {errors.fullName && (
        <p className="text-sm text-red-500">{errors.fullName.message}</p>
      )}
    </form>
  );
};
```

---

## 5. Backend Guidelines

### 5.1 — Folder Structure Convention

```
apps/api/src/
├── controllers/     # user.controller.ts, match.controller.ts
├── services/        # user.service.ts, trust-score.service.ts
├── models/          # user.model.ts, match.model.ts
├── routes/          # user.routes.ts, payment.routes.ts
├── middlewares/     # auth.middleware.ts, validate.middleware.ts
├── validators/      # user.validator.ts, payment.validator.ts
├── utils/           # app.error.ts, api.response.ts, jwt.util.ts
├── config/          # cors.config.ts, logger.config.ts, env.config.ts
├── prisma/          # client.ts (Prisma client singleton)
└── index.ts         # App entry point
```

> **Folders are lowercase.** Files inside them use `dot.notation`. No PascalCase folders on the backend.

### 5.2 — Controller Pattern

Controllers **only** handle HTTP: parse request, call service, return response. Zero business logic in controllers.

```ts
// File: controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { userService } from '@/services/user.service';
import { createUserSchema } from '@/validators/user.validator';

export const userController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await userService.getById(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createUserSchema.parse(req.body);
      const user = await userService.create(validated);
      res.status(201).json({ success: true, data: user, message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  },
};
```

### 5.3 — Service Pattern

Services contain all business logic. They talk to the database via Prisma and to external APIs (Squad, Claude).

```ts
// File: services/user.service.ts
import { prisma } from '@/prisma/client';
import { squadService } from '@/services/squad.service';
import { trustScoreService } from '@/services/trust-score.service';
import { AppError } from '@/utils/app.error';
import type { CreateUserInput } from '@/models/user.model';

export const userService = {
  async getById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { economic_profile: true, squad_account: true },
    });

    if (!user) throw new AppError('User not found', 404);
    return user;
  },

  async create(input: CreateUserInput) {
    // 1. Create user
    const user = await prisma.user.create({ data: input });

    // 2. Create Squad virtual account
    const squadAccount = await squadService.createVirtualAccount(user);

    // 3. Save Squad account reference
    await prisma.squadAccount.create({
      data: { user_id: user.id, ...squadAccount },
    });

    // 4. Initialize trust score
    await trustScoreService.initialize(user.id);

    return user;
  },
};
```

### 5.4 — Route Pattern

```ts
// File: routes/user.routes.ts
import { Router } from 'express';
import { userController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validate.middleware';
import { createUserSchema } from '@/validators/user.validator';

const router = Router();

router.get('/:userId', authMiddleware, userController.getProfile);
router.post('/', validateRequest(createUserSchema), userController.createUser);

export default router;
```

```ts
// File: index.ts — mount all routes
import userRoutes from '@/routes/user.routes';
import paymentRoutes from '@/routes/payment.routes';
import matchRoutes from '@/routes/match.routes';

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/matches', matchRoutes);
```

### 5.5 — Validation Middleware

**All request bodies are validated before hitting the controller:**

```ts
// File: middlewares/validate.middleware.ts
import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
};
```

```ts
// File: validators/user.validator.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['TRADER', 'SEEKER', 'BUYER']),
});

export const updateProfileSchema = z.object({
  tradeCategory: z.string().optional(),
  description: z.string().max(500).optional(),
  location: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
```

> **Model files are for TypeScript types only.** Zod schemas live in `.validator.ts`. Keep them separate.

```ts
// File: models/user.model.ts — TypeScript types & interfaces only
export type UserType = 'TRADER' | 'SEEKER' | 'BUYER';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  trustScore: number;
  status: UserStatus;
  createdAt: Date;
}

export interface EconomicProfile {
  id: string;
  userId: string;
  tradeCategory: string;
  skills: string[];
  description: string;
  yearsExperience: number;
}
```

---

## 6. CORS Configuration

CORS is configured on the backend to whitelist only known frontend origins. **Never use `origin: '*'` in any environment.**

```ts
// File: config/cors.config.ts
import cors from 'cors';

const ALLOWED_ORIGINS: Record<string, string[]> = {
  development: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  production: [
    'https://sabi.vercel.app',        // replace with actual production domain
    'https://www.trysabi.com',        // replace with actual custom domain
  ],
  test: [
    'http://localhost:3000',
  ],
};

const CurrentOrigins = ALLOWED_ORIGINS[process.env.NODE_ENV ?? 'development'];

export const CorsConfig = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, webhooks)
    if (!origin) return callback(null, true);

    if (CurrentOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' is not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  credentials: true,        // Required for HTTP-only cookies (refresh tokens)
  maxAge: 86400,            // Cache preflight for 24 hours
});
```

```ts
// File: index.ts — apply CORS before all routes
import { corsConfig } from '@/config/cors.config';

const app = express();

app.use(corsConfig);
app.options('*', corsConfig);   // Handle preflight for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ... routes below
```

> **Squad Webhook note:** Squad's webhook calls come from their servers with no browser origin. The `!origin` early return above handles this correctly — do not remove it.

---

## 7. Environment Variables

### Frontend — `apps/web/.env.local`

```bash
# ─── App ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_NAME=Sabi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Backend API ───────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5000

# ─── Feature Flags ─────────────────────────────────────────────────────────
NEXT_PUBLIC_ENABLE_VOUCHING=false
NEXT_PUBLIC_ENABLE_DIASPORA=false
```

> **Rule:** Any variable exposed to the browser **must** be prefixed with `NEXT_PUBLIC_`. Never put secrets (API keys, DB strings) in frontend env files.

---

### Backend — `apps/api/.env`

```bash
# ─── Server ────────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000
APP_NAME=Sabi API
API_VERSION=v1

# ─── Database ──────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/sabi_dev

# ─── Auth ──────────────────────────────────────────────────────────────────
JWT_SECRET=replace_with_minimum_32_character_random_string
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=replace_with_different_minimum_32_character_string
JWT_REFRESH_EXPIRES_IN=7d

# ─── Squad API ─────────────────────────────────────────────────────────────
SQUAD_API_KEY=sandbox_sk_xxxxxxxxxxxxxxxxxxxxxxxxxx
SQUAD_BASE_URL=https://sandbox-api-d.squadco.com
SQUAD_WEBHOOK_SECRET=replace_with_squad_webhook_secret

# ─── Claude AI ─────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_MAX_TOKENS=1000

# ─── Cloudinary ────────────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── CORS ──────────────────────────────────────────────────────────────────
ALLOWED_ORIGIN_DEV=http://localhost:3000
ALLOWED_ORIGIN_PROD=https://sabi.vercel.app

# ─── Logging ───────────────────────────────────────────────────────────────
LOG_LEVEL=debug
```

---

### `.env.example` files

Commit these to the repo. **Never commit actual `.env` files.**

**`apps/web/.env.example`**
```bash
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_ENABLE_VOUCHING=
NEXT_PUBLIC_ENABLE_DIASPORA=
```

**`apps/api/.env.example`**
```bash
NODE_ENV=
PORT=
APP_NAME=
API_VERSION=

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

SQUAD_API_KEY=
SQUAD_BASE_URL=
SQUAD_WEBHOOK_SECRET=

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
ANTHROPIC_MAX_TOKENS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ALLOWED_ORIGIN_DEV=
ALLOWED_ORIGIN_PROD=

LOG_LEVEL=
```

> **Switching Squad to production:** Change `SQUAD_API_KEY` to your live key and `SQUAD_BASE_URL` to `https://api-d.squadco.com`. One line change. That is why this is in env — not hardcoded anywhere.

---

## 8. Git Workflow

### Branch Naming

| Branch | Pattern | Example |
|--------|---------|---------|
| Feature | `feat/short-description` | `feat/onboarding-chat` |
| Bug fix | `fix/short-description` | `fix/trust-score-calc` |
| Chore | `chore/short-description` | `chore/prisma-migrations` |
| Hotfix | `hotfix/short-description` | `hotfix/squad-webhook-500` |

**Rules:**
- All lowercase kebab-case for branch names
- Branch from `dev`, not `main`
- Never push directly to `main` or `dev`
- One feature per branch

### Commit Message Format

```
type(scope): short description in present tense

# Examples:
feat(onboarding): add Claude AI session management
fix(squad): handle virtual account creation timeout
chore(prisma): add trust score fields to user model
docs(api): update payment endpoints in README
style(TrustScoreCard): fix alignment on mobile viewport
test(UserService): add unit tests for GetById method
refactor(MatchService): simplify scoring algorithm
```

**Types:** `feat` | `fix` | `chore` | `docs` | `style` | `test` | `refactor`

**Rules:**
- Present tense ("add" not "added")
- No period at the end
- Max 72 characters on the first line
- Reference issue number if applicable: `feat(match): add AI scoring (#12)`

### Pull Request Rules

- PR title follows the same format as commit messages
- All PRs target `dev`, never `main`
- At least one team member reviews before merging
- PR description must include: **What** was built, **Why**, and **How to test**
- No PR merges with failing TypeScript compilation

---

## 9. Code Quality Standards

### TypeScript Rules

```ts
// ✅ Correct — explicit types everywhere
const GetTrustScore = async (userId: string): Promise<number> => {
  return 82;
};

// ❌ Wrong — implicit any
const GetTrustScore = async (userId) => {
  return 82;
};
```

```json
// tsconfig.json — strict mode always on
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### What Not To Do

```ts
// ❌ Never use 'any'
const data: any = await fetch(...);

// ❌ Never suppress TypeScript errors
// @ts-ignore
// @ts-expect-error

// ❌ Never use console.log in production code — use the logger
console.log('user created');                 // ❌
logger.info('User created', { userId });     // ✅

// ❌ Never hardcode secrets
const apiKey = 'sk-ant-abc123';            // ❌
const apiKey = process.env.ANTHROPIC_API_KEY; // ✅

// ❌ Never swallow errors silently
try {
  await SquadService.CreateVirtualAccount();
} catch (e) {}  // ❌ empty catch

// ❌ Never put business logic in controllers
// ❌ Never call Prisma directly from controllers
// ❌ Never call external APIs directly from controllers
```

### Logger Usage (Backend)

```ts
// File: config/logger.config.ts
import winston from 'winston';

export const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// Usage
logger.info('Squad virtual account created', { userId, accountNumber });
logger.error('Squad API failed', { error: err.message, userId });
logger.warn('Trust score below threshold', { userId, score });
logger.debug('Matching engine called', { seekerId, opportunityCount });
```

---

## 10. API Response Standards

Every API response follows this exact shape. No exceptions.

```ts
// Success response
{
  "success": true,
  "message": "User profile retrieved",
  "data": { ... }
}

// Error response
{
  "success": false,
  "message": "User not found",
  "errors": null         // or validation error object
}

// Paginated response
{
  "success": true,
  "message": "Matches retrieved",
  "data": [ ... ],
  "meta": {
    "total": 48,
    "page": 1,
    "perPage": 10,
    "totalPages": 5
  }
}
```

```ts
// File: utils/api.response.ts
export class ApiResponse {
  static Success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static Error(res: Response, message: string, statusCode = 400, errors = null) {
    return res.status(statusCode).json({ success: false, message, errors });
  }

  static Paginated<T>(res: Response, data: T[], total: number, page: number, perPage: number) {
    return res.status(200).json({
      success: true,
      data,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    });
  }
}
```

---

## 11. Error Handling

### AppError Class

```ts
// File: utils/app.error.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage in services
if (!user) throw new AppError('User not found', 404);
if (trustScore < 0) throw new AppError('Invalid trust score', 400);
```

### Global Error Middleware

```ts
// File: middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/app.error';
import { logger } from '@/config/logger.config';
import { ZodError } from 'zod';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    });
  }

  // Known operational errors
  if (err instanceof AppError) {
    logger.warn(err.message, { statusCode: err.statusCode, path: req.path });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown errors — never expose internals to client
  logger.error('Unhandled error', { error: err.message, stack: err.stack, path: req.path });
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again.',
  });
};
```

```ts
// File: index.ts — register AFTER all routes
app.use(globalErrorHandler);
```

---

## Quick Reference — Do & Don't

| Do | Don't |
|----|-------|
| Use `pnpm` | Use `npm` or `yarn` |
| PascalCase for **frontend** files (`TrustScoreCard.tsx`) | Mix conventions between frontend and backend |
| dot.notation for **backend** files (`user.controller.ts`) | Use PascalCase for backend files |
| camelCase for all variables and functions | Use PascalCase for variables/functions |
| Use `cn()` for conditional Tailwind classes | Concatenate Tailwind strings |
| Validate all request bodies with Zod | Trust raw `req.body` |
| Use `logger` for all backend logging | Use `console.log` |
| Keep business logic in services | Put logic in controllers |
| Use `AppError` for thrown errors | Throw raw `new Error()` |
| Branch from `dev` | Branch from `main` |
| Write `NEXT_PUBLIC_` for browser vars | Expose secrets to frontend |
| Use `SCREAMING_SNAKE_CASE` for constants | Use camelCase for constants |
| Keep types in `.model.ts`, schemas in `.validator.ts` | Mix Zod schemas and TypeScript types in one file |

---

*Last updated: Sabi Hackathon Build Sprint — Squad Hackathon 3.0*
*Maintained by: The Sabi Team*
