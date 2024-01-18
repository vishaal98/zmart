const express = require("express");
const router = express.Router();
// const passport = require("passport");

router.use("/auth", require("./auth_route.js"));

// passport.authenticate("jwt", { session: false });
router.use("/users", require("./user_route.js"));
router.use("/products", require("./product_route.js"));
router.use("/cart", require("./cart_route.js"));

module.exports = router;
