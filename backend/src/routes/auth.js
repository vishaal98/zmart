const express = require("express");
const router = express.Router();
const passport = require("passport");
const config = require("../config/config");

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "Login Successful",
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: "Not Authorized",
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login failed",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(config.google.client_url);
});

// for google authentication

router.get("/test", (req, res) => {
  console.log("testing is working");
  res.redirect("/auth/google");
});

module.exports = router;
