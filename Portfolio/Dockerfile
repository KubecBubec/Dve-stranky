# Multi-stage build pre React aplikáciu

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments pre environment variables
ARG VITE_EMAILJS_PUBLIC_KEY
ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_TEMPLATE_ID

# Nastavenie environment variables pre build
ENV VITE_EMAILJS_PUBLIC_KEY=${VITE_EMAILJS_PUBLIC_KEY}
ENV VITE_EMAILJS_SERVICE_ID=${VITE_EMAILJS_SERVICE_ID}
ENV VITE_EMAILJS_TEMPLATE_ID=${VITE_EMAILJS_TEMPLATE_ID}

# Kopírovanie package súborov
COPY package*.json ./

# Inštalácia závislostí
RUN npm ci

# Kopírovanie zdrojových súborov
COPY . .

# Build produkčnej verzie
RUN npm run build

# Zabezpečenie, že SEO súbory sú v dist/ priečinku
RUN if [ -f sitemap.xml ]; then cp sitemap.xml dist/; fi
RUN if [ -f robots.txt ]; then cp robots.txt dist/; fi

# Stage 2: Production - Nginx pre statické súbory
FROM nginx:alpine
    
# Kopírovanie build súborov z builder stage (vrátane SEO súborov)
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopírovanie nginx konfigurácie pre SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposovanie portu 80
EXPOSE 80

# Spustenie nginx
CMD ["nginx", "-g", "daemon off;"]

