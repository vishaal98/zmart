const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/cart_controller");
const auth = require("../../middlewares/auth");

router.get("/getcart", auth, cartController.listCart);
router.post("/addtocart", auth, cartController.addToCart);
router.put("/updatecart", auth, cartController.updateCart);
router.delete("/deleteitem", auth, cartController.removeFromCart);

module.exports = router;
