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

  const sqlQuery = `
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

exports.getAllArticles = () => {
  const sqlQuery = `
    SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `;

  return db.query(sqlQuery).then((result) => {
    return result.rows;
  });
};

exports.getComments = (id) => {
  const articleID = parseInt(id);

  if (isNaN(articleID) || articleID <= 0 || String(articleID) !== id) {
    return Promise.reject({
      status: 400,
      msg: "Invalid endpoint / article ID",
    });
  }

  const queryValues = [articleID];

  const sqlQuery = `
    SELECT 
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.article_id
    FROM comments
    LEFT JOIN articles ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    ORDER BY created_at ASC
    `;

  return db.query(sqlQuery, queryValues).then((result) => {
    return result.rows;
  });
};

exports.postComment = (body, id) => {
  const username = body.username;
  const commentBody = body.body;

  if (
    body.hasOwnProperty("username") &&
    body.hasOwnProperty("body") &&
    Object.keys(body).length === 2 &&
    typeof username === "string" &&
    typeof commentBody === "string"
  ) {
    const articleID = parseInt(id);
    if (isNaN(articleID) || articleID <= 0 || String(articleID) !== id) {
      return Promise.reject({
        status: 400,
        msg: "Invalid endpoint / article ID",
      });
    }
    const checkArticle = `SELECT * FROM articles WHERE article_id = $1`;
    return db
      .query(checkArticle, [articleID])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Can't find article at provided ID",
          });
        } else {
          const checkUser = `SELECT * FROM users WHERE username = $1`;
          return db.query(checkUser, [username]).then((userResult) => {
            if (userResult.rows.length === 0) {
              return Promise.reject({
                status: 404,
                msg: "User not found",
              });
            } else {
              const queryValues = [commentBody, articleID, username];
              const sqlQuery = `
              INSERT INTO comments
              (body, article_id, author, votes)
              VALUES
              ($1, $2, $3, DEFAULT)
              RETURNING *`;

              return db.query(sqlQuery, queryValues).then((result) => {
                return result.rows[0];
              });
            }
          });
        }
      })
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
};
