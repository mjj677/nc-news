const {
  getArticleByID,
  getAllArticles,
  getComments,
  postComment,
} = require("../../models/article-models/article-models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  getArticleByID(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  getAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;

  getComments(article_id)
    .then((result) => {
      res.status(200).send({ article_comments: result });
    })
    .catch(next);
};

exports.postCommentByID = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  
  postComment(body, article_id)
    .then((result) => {
      res.status(201).send({ posted_comment: result });
    })
    .catch(next);
};
