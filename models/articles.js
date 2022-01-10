const db = require("../db/connection.js");

exports.selectArticleByID = (articleID) => {
  return db
    .query(
      `SELECT articles.* , COUNT(comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [articleID]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticle = (articleID, inc_votes = 0, body) => {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1 
      WHERE article_id = $2
      RETURNING *;`,
      [inc_votes, articleID]
    )
    .then((updatedVotes) => {
      if (body) {
        return db
          .query(
            `UPDATE articles
            SET body = $1
            WHERE article_id = $2
            RETURNING *;`,
            [body, articleID]
          )
          .then((updatedBody) => {
            return updatedBody.rows[0];
          });
      }
      return updatedVotes.rows[0];
    });
};

exports.selectArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  title
) => {
  let query = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;
  let byTopic = ``;
  let groupBy = `GROUP BY articles.article_id `;
  let sortBy = `ORDER BY articles.${sort_by} `;
  let orderBy = `${order.toUpperCase()};`;

  if (topic) {
    byTopic = `WHERE articles.topic = '${topic}' `;
    query = query + byTopic;
  } else if (title) {
    byTopic = `WHERE articles.title = '${title}'`;
    query = query + byTopic;
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
      return result.rows;
    });
};

exports.addNewComment = (articleID, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Please structure your request as follows: { username: your_username, body: your comment here}",
    });
  }
  return db
    .query(
      `INSERT INTO comments
      (author, article_id, body)
      VALUES
      ($1, $2, $3)`,
      [username, articleID, body]
    )
    .then(() => {
      return db
        .query(
          `SELECT * FROM comments 
        WHERE comments.author = $1 
        AND comments.article_id = $2 
        AND comments.body = $3`,
          [username, articleID, body]
        )
        .then((result) => {
          return result.rows[0];
        });
    });
};
