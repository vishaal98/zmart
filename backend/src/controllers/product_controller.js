const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");

const listProducts = catchAsync(async (req, res) => {
  const products = await productService.getProducts();
  res.send(products);
});

const searchProducts = catchAsync(async (req, res) => {
  console.log("Request received for searching ", req.query.value);

  const products = await productService.searchProducts(req.query.value);
  res.send(products);
});

module.exports = {
  listProducts,
  searchProducts,
};
