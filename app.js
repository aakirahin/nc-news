const express = require("express");
const {
  handleStatus500,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleStatus500);

app.use("/api", apiRouter);

module.exports = app;
