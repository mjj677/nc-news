const db = require("../../db/connection");
const fs = require("fs/promises");

exports.getAllTopics = () => {
  let sqlQuery = `
    SELECT * FROM topics`;

  return db.query(sqlQuery).then((result) => {
    return result.rows;
  });
};
