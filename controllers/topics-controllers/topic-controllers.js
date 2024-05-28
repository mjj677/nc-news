const {
  getAllTopics,
  getAllEndpoints,
} = require("../../models/topics-models/topic-models.js");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  getAllEndpoints()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};
