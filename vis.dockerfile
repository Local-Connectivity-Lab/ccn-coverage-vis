FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY scripts/setup.sh ./scripts/

RUN chmod +x ./scripts/setup.sh && \
    ./scripts/setup.sh && \
    npm ci && \
    npm cache clean --force

COPY . .

RUN npm run build && npm prune --production

FROM nginx:stable-alpine
ARG NGINX_CONFIG="nginx.conf"

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY configs/${NGINX_CONFIG} /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]