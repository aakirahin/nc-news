### LINK TO HOSTED VERSION

https://ncnews.herokuapp.com/api

# SUMMARY

In this backend project, the aim was to create an Express server with RESTful API endpoints that interact with a PSQL database. `node-postgres` was used to connect to the database so the application data could be queried and dealt with in the models. The controllers, on the other hand, focussed on error handling the client's request. Each endpoint was tested using supertest. Routers were also organised to access these endpoints.

<<<<<<< HEAD
> Node.js: v17.1.0
> Postgres: 12.9
=======
* Node.js : v17.1.0
* Postgres: 12.9
>>>>>>> c689322592e3524ad689fd2f63fb80738f9d1117

# INSTRUCTIONS

## Step 1 - Cloning this repo

`cd` into the directory you want this repo to be in, then type `git clone https://github.com/aakirahin/ncnews.git` into your terminal.

## Step 2 - Installing dependencies

Run `npm install` in the IDE terminal to install the dependencies in package.json.

## Step 3 - Connecting to the database

Create a `.env.development` file and a `.env.test` file, where you will declare `PGDATABASE=nc_news` and `PGDATABASE=nc_news_test` respectively.

## Step 4 - npm scripts

Run `npm run setup-dbs` followed by `npm run seed` to create and seed the database.

## Step 5 - Running tests

<<<<<<< HEAD
To run tests, enter `npm run test`.
=======
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
>>>>>>> c689322592e3524ad689fd2f63fb80738f9d1117
