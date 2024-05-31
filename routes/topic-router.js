const topicRouter = require("express").Router()
const topicController = require("../controllers/topics-controllers/topic-controllers");


topicRouter.route("/")
  .get(topicController.getTopics)
  .post(topicController.postTopic);

module.exports = topicRouter;
