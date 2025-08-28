# --- Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Bring in only the frontend manifests first (cache friendly)
COPY frontend/package.json frontend/pnpm-lock.yaml* frontend/package-lock.json* ./

# Install deps (prefer pnpm if the lockfile exists)
# We install pnpm explicitly to avoid "pnpm: not found"
RUN if [ -f pnpm-lock.yaml ]; then \
      npm i -g pnpm@9 && pnpm i --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy the rest of the frontend sources (including .env if present)
COPY frontend/ .

# Ensure the .env exists (Vite reads VITE_* at build time). If you don't have one,
# create frontend/.env before building or this will warn but still build.
# RUN test -f .env || echo "WARNING: frontend/.env not found; using defaults"

# Build
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm run build; \
    else \
      npm run build; \
    fi

# --- Runtime stage (nginx)
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# nginx.conf is at repo-root/docker/nginx.conf; we use root context in compose
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1/healthz || exit 1
