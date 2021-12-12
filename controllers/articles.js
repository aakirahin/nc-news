const {
  selectArticleByID,
  updateVotes,
  selectArticles,
  selectCommentsOfArticle,
  addNewComment,
} = require("../models/articles");
const { checkArticleID, checkCommentRequest, checkTopic } = require("./errors");

exports.getArticleByID = (req, res, next) => {
  const { articleID } = req.params;
  Promise.all([checkArticleID(articleID), selectArticleByID(articleID)])
    .then((article) => {
      res.status(200).send({ article: article[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const { articleID } = req.params;
  const { inc_votes } = req.body;
  Promise.all([checkArticleID(articleID), updateVotes(articleID, inc_votes)])
    .then((articleInfo) => {
      res.status(200).send({
        msg: `Votes updated by ${inc_votes}`,
        updatedArticleInfo: articleInfo[1],
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  Promise.all([checkTopic(topic), selectArticles(sort_by, order, topic)])
    .then((articles) => {
      res.status(200).send({
        articles: articles[1],
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsOfArticle = (req, res, next) => {
  const { articleID } = req.params;
  Promise.all([checkArticleID(articleID), selectCommentsOfArticle(articleID)])
    .then((comments) => {
      res.status(200).send({ articleID: comments[0], comments: comments[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewComment = (req, res, next) => {
  const { articleID } = req.params;
  const { username, body } = req.body;
  Promise.all([
    checkArticleID(articleID),
    checkCommentRequest(username, body),
    addNewComment(articleID, username, body),
  ])
    .then((postedComment) => {
      res.status(201).send({
        msg: "Your comment has been posted!",
        comment: postedComment[2],
      });
    })
    .catch((err) => {
      next(err);
    });
};
