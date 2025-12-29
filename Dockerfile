# Multi-stage Dockerfile for Cloud Run: build Vite app with Node, serve with Nginx

# --- Builder stage: install and build ---
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sources
COPY . .

# Build for production (Vite outDir is 'build')
RUN npm run build

# --- Runtime stage: lightweight Nginx to serve static files ---
FROM nginx:1.25-alpine AS runner

# Copy Nginx config (SPA fallback, caching)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Cloud Run expects the container to listen on $PORT, default 8080
EXPOSE 8080

# No CMD override; Nginx image uses the default entrypoint and command
