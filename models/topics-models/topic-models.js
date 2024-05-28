const db = require("../../db/connection");

exports.getAllTopics = () => {
  let sqlQuery = `
    SELECT * FROM topics`;

  return db.query(sqlQuery).then((result) => {
    if (result.rows.length === 0)
      return Promise.reject({ status: 404, msg: "Couldn't find any topics!" });

    return result.rows;
  });
};
