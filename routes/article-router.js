const articleRouter = require("express").Router();
const articleController = require("../controllers/article-controllers/article-controllers");

articleRouter
  .route("/")
  .get(articleController.getArticles)
  .post(articleController.postArticle);

articleRouter
  .route("/:article_id")
  .get(articleController.getArticle)
  .patch(articleController.patchArticleByID)
  .delete(articleController.deleteArticleByID);

articleRouter
  .route("/:article_id/comments")
  .get(articleController.getCommentsByArticleID)
  .post(articleController.postCommentByArticleID);

module.exports = articleRouter;
