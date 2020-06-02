FROM node:14.3.0-alpine3.10

WORKDIR /app

ENV PATH ./node_modules/.bin:$PATH

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY patches/* ./patches/
COPY env.sh ./env.sh

RUN yarn install

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

EXPOSE 3000

CMD ["yarn", "start"]