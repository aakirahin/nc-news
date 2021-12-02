const { removeComment } = require("../models/comments");

exports.deleteComment = (req, res, next) => {
  const { commentID } = req.params;
  removeComment(commentID)
    .then((comment) => {
      res.status(204).send({
        msg: "Comment has been deleted!",
        commentID: commentID,
        comment: comment,
      });
    })
    .catch((err) => {
      next(err);
    });
};
