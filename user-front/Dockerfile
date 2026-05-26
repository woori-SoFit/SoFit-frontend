FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY user-front/package.json ./user-front/
COPY admin-front/package.json ./admin-front/

RUN npm ci --include=dev

COPY . .

RUN npm run build:user

FROM nginx:alpine

COPY --from=builder /app/user-front/dist /usr/share/nginx/html
COPY user-front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
