const {
  selectArticleByID,
  updateArticle,
  selectArticles,
  selectCommentsOfArticle,
  addNewComment,
} = require("../models/articles");
const { checkExists, checkValid } = require("../models/utils");

exports.getArticleByID = (req, res, next) => {
  const { articleID } = req.params;
  Promise.all([
    checkExists("articles", "article_id", articleID),
    checkValid(articleID),
    selectArticleByID(articleID),
  ])
    .then((article) => {
      res.status(200).send({ article: article[2] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { articleID } = req.params;
  const { inc_votes, body } = req.body;
  Promise.all([
    checkExists("articles", "article_id", articleID),
    checkValid(articleID),
    checkValid(inc_votes),
    updateArticle(articleID, inc_votes, body),
  ])
    .then((article) => {
      res.status(200).send({
        msg: `Article has been updated!`,
        article: article[3],
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, title } = req.query;
  Promise.all([
    checkExists("topics", "slug", topic),
    checkExists("articles", "title", title),
    selectArticles(sort_by, order, topic, title),
  ])
    .then((articles) => {
      res.status(200).send({
        articles: articles[2],
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsOfArticle = (req, res, next) => {
  const { articleID } = req.params;
  Promise.all([
    checkExists("articles", "article_id", articleID),
    checkValid(articleID),
    selectCommentsOfArticle(articleID),
  ])
    .then((comments) => {
      res.status(200).send({ articleID: comments[0], comments: comments[2] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewComment = (req, res, next) => {
  const { articleID } = req.params;
  const { username, body } = req.body;
  Promise.all([
    checkExists("articles", "article_id", articleID),
    checkExists("users", "username", username),
    checkValid(articleID),
    addNewComment(articleID, username, body),
  ])
    .then((postedComment) => {
      res.status(201).send({
        msg: "Your comment has been posted!",
        comment: postedComment[3],
      });
    })
    .catch((err) => {
      next(err);
    });
};
