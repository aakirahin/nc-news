const db = require("../db/connection.js");

exports.checkArticleID = (articleID) => {
  if (!Number.isInteger(parseInt(articleID))) {
    return Promise.reject({
      status: 400,
      msg: "Invalid article ID",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1;`, [
      articleID,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
      return articleID;
    });
};

exports.checkRequestBody = (requestBody) => {
  if (requestBody === {}) {
    return Promise.reject({
      status: 400,
      msg: "Request body is empty",
    });
  }
  return requestBody;
};

exports.checkVotes = (votes) => {
  if (!Number.isInteger(votes.inc_votes)) {
    return Promise.reject({
      status: 422,
      msg: "Votes must be an integer!",
    });
  } else if (Object.keys(votes).length > 1) {
    return Promise.reject({
      status: 422,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  } else if (!votes.hasOwnProperty("inc_votes")) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  }
  return votes;
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request" });
  } else {
    next(err);
  }
};

exports.handleStatus500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
