const {
  getArticleByID,
  getAllArticles,
  getComments,
  postComment,
  checkUserExists,
  checkArticleExists,
  patchArticle,
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

  getAllArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([getArticleByID(article_id), getComments(article_id)])
    .then(([article, comments]) => {
      res.status(200).send({ article_comments: comments });
    })
    .catch((err) => {
      if (err.status === 404) {
        return next({
          status: 404,
          msg: "Can't find comments at provided article",
        });
      }
      next(err);
    });
};

exports.postCommentByArticleID = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  const articleID = parseInt(article_id);

  if (isNaN(articleID)) {
    return next({
      status: 400,
      msg: "Invalid endpoint / article ID",
    });
  }

  Promise.all([checkUserExists(body.username), checkArticleExists(articleID)])
    .then(() => {
      return postComment(body, articleID);
    })
    .then((result) => {
      res.status(201).send({ posted_comment: result });
    })
    .catch((err) => {
      if (
        err.status === 404 &&
        err.msg === "Can't find article at provided ID"
      ) {
        return next(err);
      } else if (err.status === 404 && err.msg === "User doesn't exist") {
        return next({
          status: 404,
          msg: "User doesn't exist",
        });
      } else {
        return next(err);
      }
    });
};

exports.patchArticleByID = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  const articleID = parseInt(article_id);

  if (isNaN(articleID)) {
    return next({
      status: 400,
      msg: "Invalid endpoint / article ID",
    });
  }

  Promise.all([checkArticleExists(articleID)])
    .then(() => {
      return patchArticle(body, articleID);
    })
    .then((result) => {
      res.status(200).send({ patched_article: result });
    })
    .catch((err) => {
      if (
        err.status === 404 &&
        err.msg === "Can't find article at provided ID"
      ) {
        return next(err);
      } else {
        return next(err)
      }
    });
};
