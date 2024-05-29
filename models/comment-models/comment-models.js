const db = require("../../db/connection.js");

exports.checkCommentExists = (commentID) => {
  const sqlQuery = `SELECT * FROM comments WHERE comment_id = $1`;
  return db.query(sqlQuery, [commentID]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Can't find comment at provided ID",
      });
    }
  });
};

exports.deleteComment = (commentID) => {
  const sqlQuery = `
    DELETE FROM comments
    WHERE comment_id = $1
    `;

  return db.query(sqlQuery, [commentID]).then((result) => {
    return result;
  });
};
