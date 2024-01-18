const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product_controller");

router.get("/productList", productController.listProducts);

module.exports = router;
