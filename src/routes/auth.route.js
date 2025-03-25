const express = require("express");
const register = require("@controllers/auth/register");
const login = require("@controllers/auth/login");
const logout = require("@controllers/auth/logout");
const refreshToken = require("@controllers/auth/refresh");
const authMiddleware = require("@middlewares/auth");

const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)
  .post("/logout", logout)
  .post("/refresh", refreshToken)
  .get("/profile", authMiddleware, (req, res) => {
    res.json({
      message: "Profilingizga xush kelibsiz!",
      user: req.user,
    });
  });

module.exports = router;
