const db = require("../../db/connection");
const fs = require("fs/promises");

exports.getAllTopics = () => {
  let sqlQuery = `
    SELECT * FROM topics`;

  return db.query(sqlQuery).then((result) => {
    if (result.rows.length === 0)
      return Promise.reject({ status: 404, msg: "Couldn't find any topics!" });

    return result.rows;
  });
};

exports.getAllEndpoints = () => {
  return fs
    .readFile(
      "/Users/mattjohnston/Desktop/northcoders/Week-7/be-nc-news/endpoints.json"
    )
    .then((result) => {
      return JSON.parse(result);
    });
};
