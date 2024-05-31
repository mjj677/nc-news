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
    articles.author,
    articles.title,
    articles.article_id,
    articles.body,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

  return db.query(sqlQuery, queryValues).then(({rows}) => {
    if (!rows.length)
      return Promise.reject({
        status: 404,
        msg: "Can't find article at provided ID",
      });
    return rows;
  });
};

exports.getAllArticles = (sort_by = "created_at", order_by = "desc", topic, limit = 10, p = 1) => {
  const validSort = [
    "author",
    "title",
    "article_id",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSort.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by" });
  }
  if (!validOrder.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort order" });
  }

  limit = parseInt(limit);
  p = parseInt(p);

  if (isNaN(limit) || limit <= 0) {
    return Promise.reject({ status: 400, msg: "Invalid limit" });
  }
  if (isNaN(p) || p <= 0) {
    return Promise.reject({ status: 400, msg: "Invalid page" });
  }

  let sqlQuery = `
    SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `;
  const queryValues = [];
  if (topic) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by} LIMIT ${limit} OFFSET ${(p - 1) * limit}`;

  const totalCountQuery = `
  SELECT COUNT(*) AS total_count
  FROM articles
  ${topic ? 'WHERE topic = $1' : ''}
  `;
  return Promise.all([db.query(sqlQuery, queryValues), db.query(totalCountQuery, queryValues)])
  .then(([articles, total_count]) => {
    return { articles: articles.rows, total_count: total_count.rows[0].total_count};
  })
};

exports.getComments = (id, limit, offset) => {
  const articleID = parseInt(id);

  if (isNaN(articleID) || articleID <= 0 || String(articleID) !== id) {
    return Promise.reject({
      status: 400,
      msg: "Invalid endpoint / article ID",
    });
  }
  
  const queryValues = [articleID, limit, offset];

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
    LIMIT $2 OFFSET $3
    `;

  return db.query(sqlQuery, queryValues).then(({rows}) => {
    return rows;
  });
};

exports.checkUserExists = (username) => {
  const sqlQuery = "SELECT * FROM users WHERE username = $1";
  return db.query(sqlQuery, [username]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "User doesn't exist",
      });
    }
    return rows;
  });
};

exports.checkArticleExists = (articleID) => {
  const sqlQuery = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(sqlQuery, [articleID]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Can't find article at provided ID",
      });
    }
  });
};

exports.postComment = (body, articleID) => {
  const username = body.username;
  const commentBody = body.body;

  if (!username || !commentBody) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  const queryValues = [commentBody, articleID, username];
  const sqlQuery = `
  INSERT INTO comments
  (body, article_id, author, votes)
  VALUES
  ($1, $2, $3, DEFAULT)
  RETURNING *
  `;

  return db.query(sqlQuery, queryValues).then((result) => {
    return result.rows[0];
  });
};

exports.patchArticle = (body, articleID) => {
  const inc_votes = body.inc_votes;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: missing required field(s)",
    });
  }

  const queryValues = [inc_votes, articleID];
  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `;
  return db.query(sqlQuery, queryValues).then((result) => {
    return result.rows[0];
  });
};

exports.postArticleBody = (
  author,
  title,
  body,
  topic,
  article_img_url = 'DEFAULT'
) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: missing body field(s)",
    });
  }

  const queryValues = [title, topic, author, body];
  let sqlQuery = `
    INSERT INTO articles
    (title, topic, author, body, votes, article_img_url)
    VALUES
    ($1, $2, $3, $4, DEFAULT, `;

  if (article_img_url === "DEFAULT") {
    sqlQuery += `DEFAULT`;
  } else {
    sqlQuery += `$5`;
    queryValues.push(article_img_url);
  }

  sqlQuery += `)
  RETURNING article_id`;

  return db.query(sqlQuery, queryValues)
  .then(({ rows }) => {
    const article_id = rows[0].article_id;
    return this.getArticleByID(String(article_id))
    }).then((result) => {
      return result[0]
    })
  }

exports.checkAuthorExists = (author) => {
  const sqlQuery = `SELECT * FROM users WHERE username = $1`;
  return db.query(sqlQuery, [author]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Author doesn't exist",
      });
    }
  });
}

exports.checkTopicExists = (topic) => {
  const sqlQuery = `SELECT * FROM topics WHERE slug = $1`;
  return db.query(sqlQuery, [topic]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Topic doesn't exist",
      });
    }
  });
}

exports.deleteArticle = (articleID) => {
  const sqlQuery = `
  DELETE FROM articles
  WHERE article_id = $1
  `
  return db.query(sqlQuery, [articleID])
}

exports.validateArticleID = (articleID, next) => {
  if (isNaN(articleID)) {
    return next({
      status:400, 
      msg: "Invalid endpoint / article ID"
    })
  }
  return Promise.resolve()
}