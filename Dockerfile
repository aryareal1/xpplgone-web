# build stage — deps & build apps
FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# copy manifests first for cache
COPY package.json bun.lock turbo.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/shared/package.json packages/shared/package.json

# workspace protocol packages resolve to their own package.json (no files yet)
RUN bun install --frozen-lockfile

# api build
FROM base AS api-build
ENV NODE_ENV=production WEB_URL=https://xirpl.tigasearah.my.id API_URL=https://api-xirpl.tigasearah.my.id
COPY apps/api apps/api
COPY packages/db packages/db
COPY packages/shared packages/shared
RUN bun run --cwd apps/api build

# web build
FROM base AS web-build
ENV NEXT_PUBLIC_API_URL=https://api-xirpl.tigasearah.my.id
COPY apps/web apps/web
COPY apps/api apps/api
COPY packages/db packages/db
COPY packages/shared packages/shared
RUN bun run --cwd apps/web build

# ── api runtime ─────────────────────────────────────────────
FROM oven/bun:1.3-alpine AS api
WORKDIR /app
ENV NODE_ENV=production

COPY --from=api-build /app/apps/api/dist ./dist

EXPOSE 3611
CMD ["bun", "dist/index.js"]

# ── web runtime ─────────────────────────────────────────────
# .next/standalone bundles server + traced node_modules — plain Node runtime.
FROM node:22-alpine AS web
WORKDIR /app
ENV NODE_ENV=production PORT=3610 HOSTNAME=0.0.0.0

COPY --from=web-build /app/apps/web/.next/standalone ./
COPY --from=web-build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-build /app/apps/web/public ./apps/web/public

EXPOSE 3610
CMD ["node", "apps/web/server.js"]
