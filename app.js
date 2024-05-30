const express = require("express");
const app = express();

app.use(express.json())

const {
  getTopics,
  postTopic
} = require("./controllers/topics-controllers/topic-controllers");

const {
    getEndpoints
} = require("./controllers/app-controllers/app-controllers.js")

const {
    getArticle,
    getArticles,
    getCommentsByArticleID,
    postCommentByArticleID,
    patchArticleByID,
    postArticle
} = require("./controllers/article-controllers/article-controllers.js")

const {
    deleteCommentByID,
    patchCommentByID
} = require("./controllers/comment-controllers/comment-controllers.js")

const {
    getUsers,
    getUserByName
} = require("./controllers/user-controllers/users-controllers.js")

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticle)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.get("/api/users", getUsers)

app.get("/api/users/:username", getUserByName)

app.post("/api/articles/:article_id/comments", postCommentByArticleID)

app.post("/api/articles", postArticle)

app.post("/api/topics", postTopic)

app.patch("/api/articles/:article_id", patchArticleByID)

app.patch("/api/comments/:comment_id", patchCommentByID)

app.delete("/api/comments/:comment_id", deleteCommentByID)

app.use((err, req, res, next) => {
  if (err.code)  res.status(409).send({ msg: err.message, stack: err.stack });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "ERROR Status 500: Internal Server Error." });
});

module.exports = app;
