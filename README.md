# XI RPL

Class management system for XI RPL — daily journals (habits), daily check-ins, schedules, and albums, all in one monorepo.

## Monorepo Structure

```
├── apps/
│   ├── api/          # Backend API — ElysiaJS + Drizzle ORM (port 3601)
│   └── web/          # Frontend — Next.js 16 + React 19 + Tailwind 4 (port 3600)
├── packages/
│   ├── db/           # Database schema & migrations (Drizzle, PostgreSQL)
│   └── shared/       # Shared code & constants between apps
├── services/
│   └── card-checkins/ # ESP32 check-in card firmware (PlatformIO)
├── turbo.json        # Task runner pipeline
├── biome.json        # Lint & format
└── Dockerfile        # Multi-stage build (api & web)
```

## Tech Stack

| Layer   | Stack |
|---------|-------|
| Runtime | Bun 1.3+ |
| Monorepo| Turborepo + workspaces |
| API     | ElysiaJS, Drizzle ORM, PostgreSQL, JWT, Google OAuth |
| Web     | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Elysia Eden (type-safe client) |
| Storage | S3-compatible (S3_ENDPOINT), sharp for image processing |
| Quality | Biome (lint + format), TypeScript |

## Prerequisites

- [Bun](https://bun.sh) >= 1.3
- PostgreSQL (local or remote)

## Setup

```bash
# 1. Install dependencies
bun install

# 2. Prepare environment (copy & fill)
cp apps/api/.env.example   apps/api/.env
cp apps/web/.env.example   apps/web/.env
cp packages/db/.env.example packages/db/.env
```

Fill in the environment variables:

**`apps/api/.env`**

```
DATABASE_URL=postgres://user:pass@host:5432/xirpl
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
WEB_URL=http://localhost:3600
S3_ENDPOINT=
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET=
```

**`apps/web/.env`** — `API_URL=http://localhost:3601`

**`packages/db/.env`** — `DATABASE_URL=` (same as api)

```bash
# 3. Initialize database
bun run db:generate   # generate migrations from schema
bun run db:migrate    # run migrations
```

## Development

```bash
bun run dev          # all apps (turbo)
bun run dev:api      # API only
bun run dev:web      # Web only
```

- Web: http://localhost:3600
- API: http://localhost:3601 — root redirects to `http://localhost:3601/docs` (Scalar API docs)

## Scripts

| Command | Purpose |
|---------|---------|
| `bun run build` | Build all apps (turbo) |
| `bun run typecheck` | Typecheck all workspaces |
| `bun run lint` | Biome check |
| `bun run lint:fix` | Biome check + auto-fix |
| `bun run format` | Biome format |
| `bun run db:generate` / `db:migrate` / `db:push` / `db:pull` | Manage database schema |

## API Modules

- **Auth** — Google OAuth login, JWT bearer token (full docs at `/docs`)
- **Users** — class member data
- **IoT** — device endpoints (check-in cards)
- **Checkins** — daily check-ins (+ admin)
- **Journals** — journal / habit tracking (+ admin), PDF recap export (pdfkit)
- **Leaderboard** — streak rankings
- **Storage** — file uploads to S3-compatible storage

## Docker

Separate multi-stage builds for api and web:

```bash
docker build --target api -t xirpl-api .
docker build --target web -t xirpl-web --build-arg API_URL=https://api.example.com .
```