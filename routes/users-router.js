const express = require("express");
const {
  getUsers,
  getUserByUsername,
  patchAvatarURL,
  postNewUser,
} = require("../controllers/users");

const usersRouter = express.Router();

usersRouter.route("/").get(getUsers).post(postNewUser);
usersRouter.route("/:username").get(getUserByUsername).patch(patchAvatarURL);

module.exports = usersRouter;
