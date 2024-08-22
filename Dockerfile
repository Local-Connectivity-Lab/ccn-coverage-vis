# Multi-stage
# 1) Node image for building frontend assets
# 2) busybox stage to serve frontend assets
# based on https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
# and https://lipanski.com/posts/smallest-docker-image-static-website

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


FROM busybox

# Create a non-root user to own the files and run our server
RUN adduser -D static
USER static
WORKDIR /home/static

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY --from=builder /app/build .

# Run BusyBox httpd
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]
