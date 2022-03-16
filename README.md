### LINK TO HOSTED VERSION

https://ncnews.herokuapp.com/api

# SUMMARY

In this backend project, the aim was to create an Express server with RESTful API endpoints that interact with a PSQL database. `node-postgres` was used to connect to the database so the application data could be queried and dealt with in the models. The controllers, on the other hand, focussed on error handling the client's request. Each endpoint was tested using supertest. Routers were also organised to access these endpoints.

* Node.js: v17.1.0
* Postgres: 12.9

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

To run tests, enter `npm run test`.
