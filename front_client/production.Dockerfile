# STAGE 1
# => Build container
FROM node:14.3.0-alpine3.10 as build

# set working directory
WORKDIR /app

ENV PATH ./node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json yarn.lock ./ 
COPY yarn.lock ./yarn.lock           
COPY patches/* ./patches/

RUN yarn install --production

COPY . .

RUN yarn run build


# STAGE 2
# => Run container
FROM nginx:1.17.8-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# Static build
COPY --from=build /app/build /usr/share/nginx/html

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]