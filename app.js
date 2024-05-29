const express = require("express");
const app = express();

app.use(express.json())

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
    postCommentByArticleID,
    patchArticleByID,
} = require("./controllers/article-controllers/article-controllers.js")

const {
    deleteCommentByID
} = require("./controllers/comment-controllers/comment-controllers.js")

const {
    getUsers
} = require("./controllers/user-controllers/users-controllers.js")

const userRoutes = require("./routes/userRoutes.js")

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticle)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

// app.use("/api/users", userRoutes)

app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postCommentByArticleID)

app.patch("/api/articles/:article_id", patchArticleByID)

app.delete("/api/comments/:comment_id", deleteCommentByID)

app.use((err, req, res, next) => {
  if (err.code)  res.status(409).send({ msg: err.message });
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
