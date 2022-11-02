FROM node:16.18 AS dev-stage
WORKDIR /code

FROM dev-stage AS built-stage
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx:1.23.2 AS release-stage
COPY --from=built-stage /code/build /usr/share/nginx/html
