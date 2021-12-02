const {
  selectArticleByID,
  updateVotes,
  selectArticles,
  selectCommentsOfArticle,
  addNewComment,
} = require("../models/articles");
const { checkArticleID, checkRequestBody, checkVotes } = require("./errors");

exports.getArticleByID = (req, res, next) => {
  const { articleID } = req.params;
  Promise.all([checkArticleID(articleID), selectArticleByID(articleID)])
    .then((article) => {
      res
        .status(200)
        .send({ articleID: article[1].article_id, article: article[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const { articleID } = req.params;
  const votes = req.body;
  console.log(votes);
  Promise.all([
    checkArticleID(articleID),
    checkRequestBody(votes),
    checkVotes(votes),
    updateVotes(articleID, votes),
  ])
    .then((articleInfo) => {
      res.status(200).send({
        msg: `Votes updated by ${votes.inc_votes}`,
        articleID: articleInfo[3].article_id,
        updatedArticleInfo: articleInfo[3],
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
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
  const newComment = req.body;
  addNewComment(articleID, newComment)
    .then((postedComment) => {
      res
        .status(201)
        .send({ msg: "Your comment has been posted!", comment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
