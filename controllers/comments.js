const { removeComment } = require("../models/comments");

exports.deleteComment = (req, res, next) => {
  const { commentID } = req.params;
  removeComment(commentID)
    .then(() => {
      res.status(204).send("");
    })
    .catch((err) => {
      next(err);
    });
};
