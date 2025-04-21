FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY scripts/setup.sh ./scripts/

RUN chmod +x ./scripts/setup.sh
RUN ./scripts/setup.sh

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

FROM nginx:stable

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY configs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]