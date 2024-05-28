const express = require("express");
const app = express();

const {
  getTopics,
  getEndpoints
} = require("./controllers/topics-controllers/topic-controllers");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)

app.use((err, req, res, next) => {
  if (err.code) res.status(400).send({ msg: "Bad request" });
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
