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
