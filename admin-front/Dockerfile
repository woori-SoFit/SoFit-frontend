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
# 템플릿은 컨테이너 시작 시 nginx 공식 이미지의 entrypoint 가
# envsubst 로 ${BACKEND_URL} 등을 치환해 /etc/nginx/conf.d/default.conf 에 생성
COPY admin-front/nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
