FROM node:22-slim

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY script/setup.sh ./script/

RUN chmod +x ./script/setup.sh
RUN ./script/setup.sh

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["node", "build/src/index."]