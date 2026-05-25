FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY user-front/package.json ./user-front/
COPY admin-front/package.json ./admin-front/

RUN npm ci

COPY . .

RUN npm run build:admin

FROM nginx:alpine

COPY --from=builder /app/admin-front/dist /usr/share/nginx/html
COPY admin-front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
