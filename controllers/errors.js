const db = require("../db/connection.js");

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

exports.checkVotesRequest = (votes) => {
  if (!votes.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  } else if (/^\d+$/.test(votes.inc_votes) === false) {
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
            status: 404,
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

exports.checkCommentRequest = (comment) => {
  if (!comment.username || !comment.body) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { username: your_username, body: write your comment here }",
    });
  } else if (Object.keys(comment).length > 2) {
    return Promise.reject({
      status: 422,
      msg: "The request body must be structured as follows: { username: your_username, body: write your comment here }",
    });
  } else {
    return db
      .query(`SELECT * FROM users WHERE users.username = $1;`, [
        comment.username,
      ])
      .then((username) => {
        if (username.rows.length === 0) {
          return Promise.reject({
            status: 405,
            msg: "The username you have given does not exist in this database",
          });
        }
        return comment;
      });
  }
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

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err.status, err.msg);
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
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
  res.status(500).send({ msg: "Internal server error" });
};
