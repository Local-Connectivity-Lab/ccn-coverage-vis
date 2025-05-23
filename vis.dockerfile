FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY scripts/setup.sh ./scripts/

RUN chmod +x ./scripts/setup.sh && \
    echo "INFO: Installing OS build dependencies" && \
    ./scripts/setup.sh && \
    echo "INFO: Running npm ci" && \
    npm ci && \
    echo "INFO: Removing OS build dependencies and cleaning up apt" && \
    apt-get purge -y --auto-remove python3 pkg-config build-essential libcairo2-dev libpango1.0-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "INFO: Cleaning npm cache" && \
    npm cache clean --force

COPY index.html index.html
COPY vite.config.ts vite.config.ts
COPY src src
COPY public public


RUN npm run build && npm prune --production

FROM nginx:stable-alpine AS production
ARG NGINX_CONFIG="nginx.conf"

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY configs/${NGINX_CONFIG} /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]