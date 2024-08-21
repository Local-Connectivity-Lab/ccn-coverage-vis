# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets
# based on https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/

FROM node:18 AS builder
WORKDIR /app

# Copy just package info for install
COPY package*.json .

# install node modules
RUN npm install

# copy files for full build
COPY . .

# build the static content
RUN npm run build


# nginx state for serving content
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy static assets from builder stage
COPY --from=builder /app/build .

# Containers run nginx with global directives and daemon off
#ENTRYPOINT ["nginx", "-g", "daemon off;"]
