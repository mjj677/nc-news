const { getAllUsers } = require("../../models/user-models/users-models.js");

exports.getUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
