const {
  deleteComment,
  checkCommentExists,
  patchComment,
} = require("../../models/comment-models/comment-models.js");

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  const commentID = parseInt(comment_id);

  if (isNaN(commentID)) {
    return next({
      status: 400,
      msg: "Invalid endpoint / comment ID",
    });
  }

  Promise.all([checkCommentExists(commentID), deleteComment(commentID)])
  .then(() => {
    res.status(204).send();
  })
  .catch(next)
};

exports.patchCommentByID = (req, res, next) => {
  const { body } = req;
  let { comment_id } = req.params;

  comment_id = parseInt(comment_id);

  if (isNaN(comment_id)) {
    return next({
      status: 400,
      msg: "Invalid comment_id type",
    });
  }

  Promise.all([checkCommentExists(comment_id), patchComment(body, comment_id)])
    .then((patched_comment) => {
      res.status(200).send({ patched_comment: patched_comment[1] });
    })
    .catch(next);
};
