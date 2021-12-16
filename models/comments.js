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
    .then((result) => {
      return "Comment deleted!";
    });
};

exports.editComment = (commentID, username, inc_votes = 0, body) => {
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "Username missing",
    });
  }
  return db
    .query(
      `UPDATE comments 
      SET votes = votes + $1 
      WHERE comment_id = $2
      RETURNING *;`,
      [inc_votes, commentID]
    )
    .then((updatedVotes) => {
      if (body) {
        return db
          .query(
            `UPDATE comments 
            SET body = $1
            WHERE comment_id = $2
            RETURNING *;`,
            [body, commentID]
          )
          .then((updatedBody) => {
            return updatedBody.rows[0];
          });
      }
      return updatedVotes.rows[0];
    });
};
