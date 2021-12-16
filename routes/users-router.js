const express = require("express");
const {
  getUsers,
  getUserByUsername,
  patchAvatarURL,
} = require("../controllers/users");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.route("/:username").get(getUserByUsername).patch(patchAvatarURL);

module.exports = usersRouter;
