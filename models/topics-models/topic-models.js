const db = require("../../db/connection");
const fs = require("fs/promises");

exports.getAllTopics = () => {
  let sqlQuery = `
    SELECT * FROM topics`;

  return db.query(sqlQuery).then((result) => {
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
