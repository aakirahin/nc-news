const express = require("express");
const { deleteComment, patchComment } = require("../controllers/comments");

const commentsRouter = express.Router();

commentsRouter.delete("/:commentID", deleteComment);
commentsRouter.patch("/:commentID", patchComment);

module.exports = commentsRouter;
