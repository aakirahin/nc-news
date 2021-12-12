const db = require("../db/connection.js");

exports.removeComment = (commentID) => {
  return db
    .query(`DELETE FROM comments WHERE comments.comment_id = $1;`, [commentID])
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE comments.comment_id = $1;`,
        [commentID]
      );
    })
    .then((comment) => {
      if (comment.rows > 0) {
        Promise.reject({
          status: 500,
          msg: "Unable to delete comment",
        });
      }
      return "Comment deleted!";
    });
};

exports.editComment = (commentID, body) => {
  return db
    .query(
      `UPDATE comments 
      SET body = $1 
      WHERE comment_id = $2
      RETURNING *;`,
      [body, commentID]
    )
    .then((result) => {
      return result.rows[0];
    });
};
