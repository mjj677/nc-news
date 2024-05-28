const db = require("../../db/connection.js");

exports.getArticleByID = (id) => {
  const articleID = parseInt(id);

  if (isNaN(articleID) || articleID <= 0 || String(articleID) !== id) {
    return Promise.reject({
      status: 400,
      msg: "Invalid endpoint / article ID",
    });
  }

  const queryValues = [articleID];

  let sqlQuery = `
  SELECT 
  articles.*
  FROM articles
 JOIN topics ON topics.slug = articles.topic
   JOIN users ON users.username = articles.author
  WHERE articles.article_id = $1`;

  return db.query(sqlQuery, queryValues).then((result) => {
    if (result.rows.length === 0)
      return Promise.reject({
        status: 404,
        msg: "Can't find article at provided ID",
      });
    return result.rows;
  });
};
