# ============================================
# E-Catalog Frontend — Dockerfile
# ============================================
# Multi-stage build optimized for aPanel deployment
#
# Stage 1 (builder): install deps + Vite build → static files
# Stage 2 (runtime): Nginx serves static files only
#                    aPanel Nginx handles reverse proxy
# ============================================

# ── Stage 1: Build ─────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache optimization)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build-time env: relative URL
# aPanel Nginx will reverse-proxy /api/* requests to backend
ARG VITE_API_URL="/api"
ENV VITE_API_URL=${VITE_API_URL}

# Build static output
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default Nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# ✅ Create minimal Nginx config (aPanel will handle routing)
# This config just serves static files + SPA fallback
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    # ── Gzip compression ──────────────────────────
    gzip on;
    gzip_vary on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types text/plain application/javascript text/css application/json image/svg+xml;

    # ── Security headers ──────────────────────────
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # ── SPA routing: serve index.html for all routes ──
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ── Static asset caching ──────────────────────
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # ── Deny hidden files ──────────────────────────
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]