const express = require("express");
const { deleteComment } = require("../controllers/comments");

const commentsRouter = express.Router();

commentsRouter.delete("/:commentID", deleteComment);

module.exports = commentsRouter;
