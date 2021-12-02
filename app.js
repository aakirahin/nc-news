const express = require("express");
const {
  handleStatus500,
  handlePSQLErrors,
} = require("./controllers/errors.js");
const apiRouter = require("./routes/api-router.js");

const app = express();

app.use(express.json());
app.use(handlePSQLErrors);
app.use(handleStatus500);

app.use("/api", apiRouter);

module.exports = app;
