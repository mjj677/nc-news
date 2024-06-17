const express = require("express");
const app = express();
const cors = require('cors')

app.use(cors());
app.use(express.json());

const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index.js");

const {
  getEndpoints,
} = require("./controllers/app-controllers/app-controllers.js");

const {
  articleRouter,
  commentRouter,
  topicRouter,
  userRouter,
} = require("./routes/api-router.js");


app.get("/api", getEndpoints);

app.use("/api/topics", topicRouter)
app.use("/api/articles", articleRouter)
app.use("/api/comments", commentRouter)
app.use("/api/users", userRouter)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
