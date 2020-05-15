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

## Build and deploy images for fropuction

```
docker-compose -f docker-compose.production-build.yml up --no-start --build
```
