const { getAllUsers} = require("../../models/user-models/users-models.js");

const {checkUserExists} = require("../../models/article-models/article-models.js")

exports.getUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByName = (req, res, next) => {
  const { username } = req.params

  checkUserExists(username)
  .then((user) => {
    res.status(200).send({ user: user[0] })
  })
  .catch(next)
}