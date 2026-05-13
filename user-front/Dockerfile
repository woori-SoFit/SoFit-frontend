FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY user-front/package.json ./user-front/
COPY admin-front/package.json ./admin-front/
RUN npm ci
COPY . .
RUN npm run build:user

FROM nginx:alpine
COPY --from=builder /app/user-front/dist /usr/share/nginx/html
EXPOSE 80