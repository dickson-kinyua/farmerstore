const express = require("express");

const {
  registerUser,
  userLogin,
  logout,
} = require("../RoutesController/controller");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", userLogin);
authRouter.post("/logout", logout);

module.exports = authRouter;
