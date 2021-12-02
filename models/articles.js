const db = require("../db/connection.js");

exports.selectArticleByID = (articleID) => {
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
      return result.rows[0];
    });
};

exports.updateVotes = (articleID, votes) => {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1 
      WHERE article_id = $2
      RETURNING *;`,
      [votes.inc_votes, articleID]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectArticles = (sort_by, order, topic) => {
  let query = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;
  let byTopic = ``;
  let groupBy = `GROUP BY articles.article_id `;
  let sortBy = ``;
  let orderBy = ``;

  if (!sort_by) {
    sortBy = `ORDER BY articles.created_at `;
  } else if (
    ["article_id", "title", "votes", "topic", "author"].includes(sort_by)
  ) {
    sortBy = `ORDER BY articles.${sort_by} `;
  } else if (
    !["article_id", "title", "votes", "topic", "author"].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      msg: `Sort_by query must be one of the following: article_id, title, votes, topic, author`,
    });
  }

  if (!order) {
    orderBy = `ASC;`;
  } else if (order.toUpperCase() === "ASC" || order.toUpperCase() === "DESC") {
    orderBy = `${order.toUpperCase()};`;
  } else if (order.toUpperCase() !== "ASC" || order.toUpperCase() !== "DESC") {
    return Promise.reject({
      status: 400,
      msg: `Order must be "asc" (ascending) or "desc" (descending).`,
    });
  }

  if (topic) {
    db.query(`SELECT EXISTS(SELECT 1 FROM topics WHERE topics.slug = $1)`, [
      topic,
    ]).then((topic) => {
      if (topic.rows[0].exists === false) {
        return Promise.reject({
          status: 400,
          msg: "This topic does not exist",
        });
      }
      byTopic = `WHERE articles.topic = '${topic}' `;
      query = query + byTopic;
    });
  }

  return db.query(query + groupBy + sortBy + orderBy).then((result) => {
    return result.rows;
  });
};

exports.selectCommentsOfArticle = (articleID) => {
  return db
    .query(`SELECT * FROM comments WHERE comments.article_id = $1;`, [
      articleID,
    ])
    .then((result) => {
      const comments = result.rows;
      if (comments.length === 0) {
        return "No comments yet";
      }
      return comments;
    });
};

exports.addNewComment = (articleID, newComment) => {
  if (!newComment.username || !newComment.body) {
    return Promise.reject({
      status: 400,
      msg: `Please structure your request body as follows: { username: your_username_here, body: your_comment_here}`,
    });
  }

  return db
    .query(`SELECT EXISTS(SELECT 1 FROM users WHERE users.username = $1);`, [
      newComment.username,
    ])
    .then((username) => {
      if (username.rows[0].exists === false) {
        return Promise.reject({
          status: 405,
          msg: "The username you have given does not exist in this database",
        });
      }
    })
    .then(() => {
      return db.query(
        `INSERT INTO comments
      (author, article_id, body)
      VALUES
      ($1, $2, $3)`,
        [newComment.username, articleID, newComment.body]
      );
    })
    .then(() => {
      return db
        .query(
          `SELECT * FROM comments 
        WHERE comments.author = $1 
        AND comments.article_id = $2 
        AND comments.body = $3`,
          [newComment.username, articleID, newComment.body]
        )
        .then((result) => {
          const newComment = result.rows[0];
          return newComment;
        });
    });
};
