const userRouter = require("express").Router();
const userController = require("../controllers/user-controllers/users-controllers.js");

userRouter.route("/").get(userController.getUsers);

userRouter.route("/:username").get(userController.getUserByName);

module.exports = userRouter;
