const {
  getAllTopics,
  postTopicBody,
  checkTopic,
} = require("../../models/topics-models/topic-models.js");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((result) => {
      res.status(200).send({ Topics: result });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  Promise.all([checkTopic(slug), postTopicBody(slug, description)])
    .then((posted_topic) => {
      res.status(201).send(posted_topic[1]);
    })
    .catch(next);
};
