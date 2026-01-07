# Multi-stage Dockerfile for Cloud Run: build Vite app with Node, serve with Nginx

# --- Builder stage: install and build ---
FROM node:20-alpine AS builder
LABEL \
    org.opencontainers.image.title="SerrureMaster" \
    org.opencontainers.image.description="Premium door action plans" \
    org.opencontainers.image.version="1.0.0"
WORKDIR /app

# Build-time env for Vite (passed via --build-arg)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_GEMINI_API_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
	VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
	VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY \
	VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

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

# Copy built assets and ensure proper permissions
COPY --from=builder /app/build /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.json" \) -exec chmod 644 {} \;

# Cloud Run expects the container to listen on $PORT, default 8080
EXPOSE 8080

# No CMD override; Nginx image uses the default entrypoint and command
