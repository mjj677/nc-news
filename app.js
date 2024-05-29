const express = require("express");
const app = express();

const {
  getTopics,
} = require("./controllers/topics-controllers/topic-controllers");

const {
    getEndpoints
} = require("./controllers/app-controllers/app-controllers.js")

const {
    getArticle,
    getArticles,
    getCommentsByArticleID,
    postCommentByArticleID
} = require("./controllers/article-controllers/article-controllers.js")

app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticle)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.post("/api/articles/:article_id/comments", postCommentByArticleID)

app.use((err, req, res, next) => {
  if (err.code)  res.status(400).send({ msg: "Bad request" });

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
