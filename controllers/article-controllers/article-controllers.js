const {
  getArticleByID,
  getAllArticles,
  getComments,
  postComment,
  checkUserExists,
  checkArticleExists,
  patchArticle,
  postArticleBody,
  checkAuthorExists,
  checkTopicExists,
  deleteArticle,
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
  const { sort_by, order_by, topic, limit, p } = req.query;

  const articlePromises = getAllArticles(sort_by, order_by, topic, limit, p);
  const topicPromise = topic ? checkTopicExists(topic) : Promise.resolve();

  Promise.all([topicPromise, articlePromises])
    .then(([topicCheckResult, articleResult]) => {
      const { articles, total_count } = articleResult;
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  let { limit = 10, p = 1 } = req.query;
  limit = parseInt(limit);
  p = parseInt(p);

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).send({ msg: "Invalid limit" });
  }
  if (isNaN(p) || p <= 0) {
    return res.status(400).send({ msg: "Invalid page" });
  }

  const offset = (p - 1) * limit;

  Promise.all([getArticleByID(article_id), getComments(article_id, limit, offset)])
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
        return next(err);
      }
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  Promise.all([
    ,
    checkAuthorExists(author),
    checkTopicExists(topic),
    postArticleBody(author, title, body, topic, article_img_url),
  ])
    .then((posted_article) => {
      res.status(201).send({ posted_article: posted_article[3] });
    })
    .catch(next);
};

exports.deleteArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  const articleID = parseInt(article_id);

  if (isNaN(articleID)) {
    return next({
      status: 400,
      msg: "Invalid endpoint / article ID",
    });
  }

  Promise.all([checkArticleExists(articleID), deleteArticle(articleID)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
