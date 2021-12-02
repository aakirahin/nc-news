const db = require("../db/connection.js");

exports.selectArticleByID = (articleID) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1;`, [
      articleID,
    ])
    .then((result) => {
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
  }

  if (!order) {
    orderBy = `ASC;`;
  } else if (order.toUpperCase() === "ASC" || order.toUpperCase() === "DESC") {
    orderBy = `${order.toUpperCase()};`;
  }

  if (topic) {
    byTopic = `WHERE articles.topic = '${topic}' `;
    query = query + byTopic;
  }

  return db.query(query + groupBy + sortBy + orderBy).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `No related articles under the topic "${topic}"`,
      });
    }
    return result.rows;
  });
};

exports.selectCommentsOfArticle = (articleID) => {
  return db
    .query(`SELECT * FROM comments WHERE comments.article_id = $1;`, [
      articleID,
    ])
    .then((result) => {
      return result.rows;
    });
};

exports.addNewComment = (articleID, newComment) => {
  return db
    .query(
      `INSERT INTO comments
      (author, article_id, body)
      VALUES
      ($1, $2, $3)`,
      [newComment.username, articleID, newComment.body]
    )
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
          return result.rows[0];
        });
    });
};
