const db = require("../db/connection.js");

exports.removeComment = (commentID) => {
  return db
    .query(`DELETE FROM comments WHERE comments.comment_id = $1;`, [commentID])
    .then(() => {
      return db.query(
        `SELECT EXISTS(SELECT 1 FROM comments WHERE comments.comment_id = $1);`,
        [commentID]
      );
    })
    .then((comment) => {
      const exists = comment.rows[0];
      return exists;
    });
};
