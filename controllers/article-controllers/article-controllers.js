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

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;

    Promise.all([getArticleByID(article_id), getComments(article_id)])
    .then(([article, comments]) => {
        res.status(200).send({ article_comments: comments});
    })
    .catch((err) => {
        if (err.status === 404) {
            return next({ status:404, msg: "Can't find comments at provided article"})
        }
        next(err)
    })
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
