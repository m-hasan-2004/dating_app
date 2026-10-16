# syntax=docker/dockerfile:1

# ─── Stage 1: Build Dependencies & Production Artifacts ───
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

# If prebuilt artifacts archive exists, unpack directly; otherwise perform full build
RUN if [ -f "build_artifacts.tar.gz" ]; then \
      echo "Deploying from optimized pre-packaged standalone artifacts..."; \
      tar -xzf build_artifacts.tar.gz; \
    else \
      echo "Building from source..."; \
      npm config set fetch-retries 7; \
      npm config set fetch-retry-mintimeout 30000; \
      npm config set fetch-retry-maxtimeout 180000; \
      npm ci --no-audit; \
      npm run build; \
    fi

# ─── Stage 2: Production Runtime (Next.js Standalone + Nginx Alpine) ───
FROM node:20-alpine AS runner
WORKDIR /app

# Install lightweight Nginx and netcat for reverse-proxy & gateway check
RUN apk add --no-cache nginx netcat-openbsd

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="127.0.0.1"

# Copy Nginx configuration (reverse proxy + SPA fallback + caching)
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy standalone server and static assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy runtime entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
