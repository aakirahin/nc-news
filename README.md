### LINK TO HOSTED VERSION

https://ncnews.herokuapp.com/api

# SUMMARY

In this backend project, the aim was to create an Express server with RESTful API endpoints that interact with a PSQL database. `node-postgres` was used to connect to the database so the application data could be queried and dealt with in the models. The controllers, on the other hand, focussed on error handling the client's request. Each endpoint was tested using supertest. Routers were also organised to access these endpoints.

* Node.js : v17.1.0
* Postgres: 12.9

# INSTRUCTIONS

## Step 1 - Cloning this repo

`cd` into the directory you want this repo to be in, then type in `git clone URL` into your terminal. Replace `URL` with the URL below.
LINK TO CLONE: `https://github.com/aakirahin/ncnews.git`

## Step 2 - Installing dependencies

`npm i -D` the following, in your terminal, separately:

- `dotenv` loads environment variables
- `pg` interacts with the database
- `pg-format` creates "dynamic SQL queries"
- `jest` testing framework
- `express` to route endpoints
- `supertest` tests endpoints

The command will install each of these modules as `devDependencies`, as you'll see in your `package.json` file.

## Step 3 - Connecting to the database

There are two separate databases: one for development and the other for testing. Create a `.env.development` file and a `.env.test` file, where you will declare `PGDATABASE=database_name` with the correct database name for the specified environment.

In the `connection.js` file, require and configure `dotenv`. Create `process.env.NODE_ENV` as a separate variable so you can change the variable environment when testing.

```js
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/.env.${ENV}`,
});
```

Finally, require `pg` to export a connection `Pool`, so the set database can be queried.

## Step 4 - Seeding the database

In the `seed.js` file, we will have to require `pg` (as `db`) and `pg-format` (as `format`) in order to work with the database.

## Step 5 - npm scripts

The scripts in `package.json` should do the following:

- Run `setup.sql` which drops and creates the database
- Run `run-seed.js` so the database can be seeded
- Run `jest` tests with a (re-seeded) test database

## Step 6 - Running tests

Create an `app.test.js` file, where you will test your endpoints using `supertest`. Require:

- `app.js`
- `supertest` (as request; so you can request `app` for its endpoints)
- Test data
- `seed.js` (so `beforeEach()` test, your test data can be seeded; and `afterAll()` tests, you can end connection to the database)
- `connection.js`
- **optional** `jest-sorted` (which you will first have to install) if you're testing for sorted data
