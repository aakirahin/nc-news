const { removeComment, editComment } = require("../models/comments");
const { checkExists, checkValid } = require("../models/utils");

exports.deleteComment = (req, res, next) => {
  const { commentID } = req.params;
  Promise.all([
    checkExists("comments", "comment_id", commentID),
    checkValid(commentID),
    removeComment(commentID),
  ])
    .then(() => {
      res.status(204).send("");
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { commentID } = req.params;
  const { username, inc_votes, body } = req.body;
  Promise.all([
    checkExists("comments", "comment_id", commentID),
    checkExists("users", "username", username),
    checkValid(commentID),
    checkValid(inc_votes),
    editComment(commentID, username, inc_votes, body),
  ])
    .then((comment) => {
      res.status(200).send({ comment: comment[4] });
    })
    .catch((err) => {
      next(err);
    });
};
