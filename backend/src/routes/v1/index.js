const express = require("express");
const router = express.Router();
const userRoute = require("./user_route.js");
const authRoute = require("./auth_route.js");

router.use("/auth", authRoute);
router.use("/users", userRoute);

module.exports = router;
