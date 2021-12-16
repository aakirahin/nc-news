const express = require("express");
const {
  getArticleByID,
  patchArticle,
  getArticles,
  getCommentsOfArticle,
  postNewComment,
} = require("../controllers/articles");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.route("/:articleID").get(getArticleByID).patch(patchArticle);
articlesRouter
  .route("/:articleID/comments")
  .get(getCommentsOfArticle)
  .post(postNewComment);

module.exports = articlesRouter;
