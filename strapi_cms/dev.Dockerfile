FROM strapi/base

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

EXPOSE 1337

CMD ["yarn", "develop"]