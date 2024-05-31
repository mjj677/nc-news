const commentRouter = require("express").Router()
const commentController = require("../controllers/comment-controllers/comment-controllers.js");

commentRouter.route("/:comment_id")
  .delete(commentController.deleteCommentByID)
  .patch(commentController.patchCommentByID);

module.exports = commentRouter;
