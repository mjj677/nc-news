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
    return rows
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

exports.patchComment = (body, comment_id) => {

  const {inc_votes} = body
  if (!inc_votes) {
    return Promise.reject({
      status:400,
      msg: "Bad request: no vote value"
    })
  }

  const queryValues = [inc_votes, comment_id]
  const sqlQuery = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING * 
  `
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows
  })
}
