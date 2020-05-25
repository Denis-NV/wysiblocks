FROM node:14.3.0-alpine3.10

WORKDIR /app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install

EXPOSE 8080

ENTRYPOINT ["yarn", "server:dev"]