FROM strapi/base
# FROM node:14.3.0-alpine3.10

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

EXPOSE 1337

CMD ["yarn", "develop"]