# ==============================================================================
# 1. BUILD STAGE: Compile React+Vite Assets
# ==============================================================================
FROM node:20-alpine AS build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests to leverage Docker caching
COPY package*.json ./

# Install frontend dependencies cleanly using npm ci for production stability
RUN npm ci

# Copy the entire frontend codebase
COPY . .

# Build the production-ready static assets (creates the /app/dist directory)
RUN npm run build

# ==============================================================================
# 2. PRODUCTION STAGE: Serve Static Files with Nginx
# ==============================================================================
FROM nginx:1.25-alpine AS production-stage

# Copy the compiled static assets from the build stage to Nginx's default public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration to support client-side routing (React Router fallback)
# This prevents 404 errors when reloading sub-pages directly in the browser
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx in the foreground to keep the container running
CMD ["nginx", "-g", "daemon off;"]