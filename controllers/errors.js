const db = require("../db/connection.js");

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code) {
    res.status(400).send({ msg: err.message || "Bad Request" });
  } else {
    next(err);
  }
};

exports.handleStatus500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.checkArticleID = (articleID) => {
  if (!articleID.match(/^\d+$/)) {
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
  if (Object.keys(requestBody).length === 0) {
    return Promise.reject({
      status: 400,
      msg: "Request body is empty",
    });
  }
  return requestBody;
};

exports.checkTopic = (topic) => {
  if (!topic) {
    return "Nothing to check";
  }
  return db
    .query(`SELECT * FROM topics WHERE topics.slug = $1;`, [topic])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Topic does not exist",
        });
      }
      return topic;
    });
};

exports.checkCommentRequest = (username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { username: your_username, body: write your comment here }",
    });
  }
  return db
    .query(`SELECT * FROM users WHERE users.username = $1;`, [username])
    .then((username) => {
      if (username.rows.length === 0) {
        return Promise.reject({
          status: 405,
          msg: "The username you have given does not exist in this database",
        });
      }
      return body;
    });
};

exports.checkCommentID = (commentID) => {
  if (!commentID.match(/^\d+$/)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid comment ID",
    });
  }
  return db
    .query(`SELECT * FROM comments WHERE comments.comment_id = $1;`, [
      commentID,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment ID does not exist",
        });
      }
      return commentID;
    });
};

exports.checkUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE users.username = $1;`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Username does not exist",
        });
      }
      return username;
    });
};
