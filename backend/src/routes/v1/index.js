const express = require("express");
const router = express.Router();
const userRoute = require("./user_route.js");
const authRoute = require("./auth_route.js");
// const passport = require("passport");

router.use("/auth", authRoute);

// passport.authenticate("jwt", { session: false });
router.use("/users", userRoute);

module.exports = router;
