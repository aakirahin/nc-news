const { selectUsers, selectUserByUsername } = require("../models/users");
const { checkUsername } = require("./errors");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  Promise.all([checkUsername(username), selectUserByUsername(username)])
    .then((user) => {
      res.status(200).send({ user: user[1] });
    })
    .catch((err) => {
      next(err);
    });
};
