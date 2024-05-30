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
  const { sort_by, order_by, topic, limit, page } = req.query;

  getAllArticles(sort_by, order_by, topic, limit, page)
    .then(({articles, total_count}) => {
      res.status(200).send({ articles, total_count });
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
        return next(err);
      }
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  Promise.all([,
    checkAuthorExists(author),
    checkTopicExists(topic),
    postArticleBody(author, title, body, topic, article_img_url)
  ])
    .then((posted_article) => {
      res.status(201).send({ posted_article: posted_article[3] });
    })
    .catch(next);
};
