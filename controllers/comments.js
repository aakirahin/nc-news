const { removeComment, editComment } = require("../models/comments");
const { checkCommentID, checkCommentRequest } = require("./errors");

exports.deleteComment = (req, res, next) => {
  const { commentID } = req.params;
  Promise.all([checkCommentID(commentID), removeComment(commentID)])
    .then(() => {
      res.status(204).send("");
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { commentID } = req.params;
  const { username, body } = req.body;
  Promise.all([
    checkCommentID(commentID),
    checkCommentRequest(username, body),
    editComment(commentID, body),
  ])
    .then((comment) => {
      res.status(200).send({ editedComment: comment[2] });
    })
    .catch((err) => {
      next(err);
    });
};
