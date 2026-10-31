# =========================
# BUILD STAGE
# =========================

FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# =========================
# RUNTIME STAGE
# =========================

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/linkvault-frontend/browser /usr/share/nginx/html

EXPOSE 80