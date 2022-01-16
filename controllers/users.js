const {
  selectUsers,
  selectUserByUsername,
  editAvatar,
  addNewUser,
} = require("../models/users");
const { checkExists, checkUnique } = require("../models/utils");

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
  Promise.all([
    checkExists("users", "username", username),
    selectUserByUsername(username),
  ])
    .then((user) => {
      res.status(200).send({ user: user[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchAvatarURL = (req, res, next) => {
  const { username } = req.params;
  const { avatar_url } = req.body;
  Promise.all([
    checkExists("users", "username", username),
    editAvatar(username, avatar_url),
  ])
    .then((user) => {
      res.status(200).send({ user: user[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  Promise.all([
    checkUnique("users", "username", username),
    addNewUser(username, name, avatar_url),
  ])
    .then((user) => {
      res.status(201).send({ msg: "User has been created", user: user[1] });
    })
    .catch((err) => {
      next(err);
    });
};
