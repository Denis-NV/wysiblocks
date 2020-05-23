# wysiblocks

## MongoDB installation and setup

### Creating users

Create separate users for each service that will be using the database to make things more secure. To create a new user first run a mongoDB container and take note of root (admin) user name and password. When contaoner is running fo the follown steps from CLI:

1. Start an interactive shell on the mongodb container:

   ```
   $ docker exec -it [container name] bash
   ```

2. Log in to the MongoDB root administrative account:

   ```
   # mongo -u [root user name] -p
   ```

   _You will be prompted to enter the root user password_

3. Switch to the database you want to create a user for:

   ```
   > use [database name]
   ```

4. Create a new user that will be allowed to access this database:

   ```
   db.createUser({user: '[new user name]', pwd: '[new user password]', roles: [{role: 'readWrite', db: '[database name]'}]})
   ```

## Strapi installation and setup

### CLI install

```
? Choose your default database client
? Choose your default database client mongo
? Database name: (strapi_cms)
? Database name: strapi_cms
? Host: (127.0.0.1)
? Host: 127.0.0.1
? +srv connection: (false)
? +srv connection: false
? Port (It will be ignored if you enable +srv): (27017)
? Port (It will be ignored if you enable +srv): 27017
? Username: strapi
? Username: strapi
? Password: *******************
? Password: *******************
? Authentication database (Maybe "admin" or blank): strapi_cms
? Authentication database (Maybe "admin" or blank): strapi_cms
? Enable SSL connection: (y/N) N
? Enable SSL connection: No
```

### Available commands in your project:

Start Strapi in watch mode.

```
yarn develop
```

Start Strapi without watch mode.

```
yarn start
```

Build Strapi admin panel.

```
yarn build
```

Display all available commands.

```
yarn strapi
```

## Keycloak development

1. Create a folder for your theme (keycloak/themes/wysiblocks)
2. Mount that folder into keycloak
   ```
   ...
   volumes:
      - ./keycloak/themes/wysiblocks:/opt/jboss/keycloak/themes/wysiblocks
   ...
   ```
3. Run the keyclak container (along with the rest of the stack)
4. Copy two themes (for reference and to use as basis) and two config files (to enable dev mode)

   ```
   $ docker cp wysiblocks_keycloak:/opt/jboss/keycloak/themes/keycloak .\keycloak\themes\keycloak

   $ docker cp wysiblocks_keycloak:/opt/jboss/keycloak/themes/base .\keycloak\themes\base

   $ docker cp wysiblocks_keycloak:/opt/jboss/keycloak/standalone/configuration/standalone.xml .\keycloak\configuration\standalone.xml

   $ docker cp wysiblocks_keycloak:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml .\keycloak\configuration\standalone-ha.xml
   ```

5. Update 3 values inside newly copied config files (standalone.xml, standalone-ha.xml)
   ```
   <staticMaxAge>-1</staticMaxAge>
   <cacheThemes>false</cacheThemes>
   <cacheTemplates>false</cacheTemplates>
   ```
6. Stop the containers stack and mount the new files into the keycloak container
   ```
   ...
   volumes:
      - ./keycloak/themes/wysiblocks:/opt/jboss/keycloak/themes/wysiblocks
      - ./keycloak/configuration/standalone.xml:/opt/jboss/keycloak/standalone/configuration/standalone.xml
      - ./keycloak/configuration/standalone-ha.xml:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml
   ...
   ```
7. Run the container stack again
8. Copy appropriate folder and file stucture from "base" theme into your theme folder (wysiblocks) (https://www.keycloak.org/docs/latest/server_development/#creating-a-theme)

#### Sass instructions

Make sure you have 'sass' processor installed. If not, install it globally

```
$ yarn global add sass

```

Start sass process in watch mode for the login.scss file of your theme (wysiblocks)

```
$  sass --watch keycloak/themes/wysiblocks/login/resources/scss/login.scss keycloak/themes/wysiblocks/login/resources/css/login.css
```

## Build and deploy images for production

```
$ docker-compose -f docker-compose.production-build.yml up --no-start --build

$ docker-compose -f docker-compose.production-build.yml down
```
