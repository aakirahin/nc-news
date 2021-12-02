const express = require("express");
const {
  getArticleByID,
  patchVotes,
  getArticles,
  getCommentsOfArticle,
  postNewComment,
} = require("../controllers/articles");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:articleID", getArticleByID);
articlesRouter.get("/:articleID/comments", getCommentsOfArticle);
articlesRouter.patch("/:articleID", patchVotes);
articlesRouter.post("/:articleID/comments", postNewComment);

module.exports = articlesRouter;
