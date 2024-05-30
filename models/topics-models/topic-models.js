const db = require("../../db/connection");
const fs = require("fs/promises");

exports.getAllTopics = () => {
  const sqlQuery = `
    SELECT * FROM topics`;

  return db.query(sqlQuery).then((result) => {
    return result.rows;
  });
};

exports.postTopicBody = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: missing body field(s)",
    });
  }

  const sqlQuery = `
  INSERT INTO topics
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *
  `;

  return db.query(sqlQuery, [slug, description]).then(({ rows }) => {
    return rows[0];
  });
};

exports.checkTopic = (slug) => {
  const sqlQuery = `
  SELECT * FROM topics 
  WHERE slug = $1
  `;

  return db.query(sqlQuery, [slug]).then(({ rows }) => {
    if (rows.length) {
      return Promise.reject({
        status: 409,
        msg: "409: Topic already exists",
      });
    }
  });
};

