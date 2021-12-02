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
  if (!requestBody || requestBody === {}) {
    return Promise.reject({
      status: 400,
      msg: "Request body is empty",
    });
  }
  return requestBody;
};

exports.checkVotes = (votes) => {
  if (!votes.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  } else if (!Number.isInteger(votes.inc_votes)) {
    return Promise.reject({
      status: 422,
      msg: "Votes must be an integer!",
    });
  } else if (Object.keys(votes).length > 1) {
    return Promise.reject({
      status: 422,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  }
  return votes;
};

exports.checkSortByQuery = (sort_by) => {
  if (
    !sort_by ||
    ["article_id", "title", "votes", "topic", "author"].includes(sort_by)
  ) {
    return sort_by;
  } else if (
    !["article_id", "title", "votes", "topic", "author"].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      msg: `Sort_by query must be one of the following: article_id, title, votes, topic, author`,
    });
  }
};

exports.checkOrderQuery = (order) => {
  if (
    !order ||
    order.toUpperCase() === "ASC" ||
    order.toUpperCase() === "DESC"
  ) {
    return order;
  } else if (order.toUpperCase() !== "ASC" || order.toUpperCase() !== "DESC") {
    return Promise.reject({
      status: 400,
      msg: `Order must be "asc" (ascending) or "desc" (descending).`,
    });
  }
};

exports.checkTopicQuery = (topic) => {
  if (topic) {
    return db
      .query(`SELECT * FROM topics WHERE topics.slug = $1;`, [topic])
      .then((topic) => {
        if (topic.rows.length === 0) {
          return Promise.reject({
            status: 400,
            msg: "This topic does not exist",
          });
        }
        return topic;
      });
  }
  return "Topic not defined";
};

exports.noComments = (articleID) => {
  return db
    .query(`SELECT * FROM comments WHERE comments.article_id = $1;`, [
      articleID,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments yet",
        });
      }
      return articleID;
    });
};

exports.checkComment = (newComment) => {
  if (!newComment.username || !newComment.body) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { username: your_username, body: write your comment here }",
    });
  } else if (
    typeof newComment.username !== "string" ||
    typeof newComment.body !== "string"
  ) {
    return Promise.reject({
      status: 422,
      msg: "Username and body must be a string",
    });
  } else if (Object.keys(newComment).length > 2) {
    return Promise.reject({
      status: 422,
      msg: "The request body must be structured as follows: { username: your_username, body: write your comment here }",
    });
  } else {
    return db
      .query(`SELECT * FROM users WHERE users.username = $1;`, [
        newComment.username,
      ])
      .then((username) => {
        if (username.rows.length === 0) {
          return Promise.reject({
            status: 405,
            msg: "The username you have given does not exist in this database",
          });
        }
        return newComment;
      });
  }
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
