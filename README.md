# Storefront Backend Project

## Setup Project

### 1. Run `npm install` to install package dependencies

### 2. Setup PostgreSQL & create database user

- Setup PostgreSQL on premise or use PostgreSQL docker
- Create database user & database:

  ```sql
  CREATE USER full_stack_user WITH PASSWORD 'password123';

  CREATE DATABASE full_stack_dev;

  \c full_stack_dev

  GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
  ```

### 3. Create `.env` file

```
PORT=3000

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=full_stack_dev
POSTGRES_USER=full_stack_user
POSTGRES_PASSWORD=password123

POSTGRES_TEST_DB=full_stack_test

PASSWORD_SECRET=123456
SALT_ROUND=10

TOKEN_SECRET=123456
```

- `PORT`: the port number to run server api
- `POSTGRES_HOST`: the host of database server
- `POSTGRES_DB`: the database name
- `POSTGRES_USER`: the username of database server
- `POSTGRES_PASSWORD`: the password of database server
- `POSTGRES_TEST_DB`: the test database name
- `PASSWORD_SECRET`: the key to hash user password with `bcrypt`. (Default: `123456`, if change, please update password for admin in migration script `migrations/sqls/20230707091801-admin-table-up.sql`)
- `SALT_ROUND`: the parameter to for `bcrypt`
- `TOKEN_SECRET`: the secret to check `jwt` token

### 4. Database migrations

- Update `database.json` file

  ```json
  {
    "dev": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "full_stack_dev",
      "user": "full_stack_user",
      "password": "password123"
    },
    "test": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "full_stack_test",
      "user": "full_stack_user",
      "password": "password123"
    }
  }
  ```

- Update `.env` file if necessary
- Update script `test:prepare` in `package.json` file if using other test database (default: `full_stack_test`)
- Run migrations script

  ```
  db-migrate up
  ```

## Run the project

Open the terminal, run (default host: `localhost:3000`):

```
npm run dev
```

Admin Account to login system:

```
username: admin
password: 123456
```

To run production, run:

```
npm run dev
```

## Run test for the project

Open the terminal, run:

```
npm run test
```

- Note: please make sure setup `.env` file and `database.json` file`

## API Endpoints

### 1. Admin

- [GET] /admins [admin token required]
- [GET] /admins/:id [admin token required]
- [POST] /admins [admin token required]
- [POST] /admins/login

### 2. User

- [GET] /users [admin token required]
- [GET] /users/:id [admin token required]
- [POST] /users [admin token required]
- [DELETE] /users/:id [admin token required]

### 3. Product

- [GET] /products
- [GET] /products/:id
- [POST] /products [admin token required]
- [DELETE] /products/:id [admin token required]

### 4. Order

- [GET] /users/:userId/orders [admin token required]
- [GET] /users/:userId/orders/:id [admin token required]
- [POST] /users/:userId/orders [admin token required]
- [DELETE] /users/:userId/orders/:id [admin token required]
- [POST] /users/:userId/orders/:id/products [admin token required]
- [POST] /users/:userId/orders/:id/complete [admin token required]

\*\* Note: request & response of the API, please refer to `StoreFront_API.postman_collection.json` file

## Connect to API

Using postman collection that import from `StoreFront_API.postman_collection.json` file
