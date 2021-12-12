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
articlesRouter.route("/:articleID").get(getArticleByID).patch(patchVotes);
articlesRouter
  .route("/:articleID/comments")
  .get(getCommentsOfArticle)
  .post(postNewComment);

module.exports = articlesRouter;
