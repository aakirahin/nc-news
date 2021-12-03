const { removeComment, editComment } = require("../models/comments");
const {
  checkCommentID,
  checkRequestBody,
  checkCommentRequest,
} = require("./errors");

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
  const editedComment = req.body;
  Promise.all([
    checkCommentID(commentID),
    checkRequestBody(editedComment),
    checkCommentRequest(editedComment),
    editComment(commentID, editedComment),
  ])
    .then((comment) => {
      res.status(200).send({ editedComment: comment[3] });
    })
    .catch((err) => {
      next(err);
    });
};
