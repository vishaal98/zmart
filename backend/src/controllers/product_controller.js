const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");

const listProducts = catchAsync(async (req, res) => {
  const products = await productService.getProducts();
  res.send(products);
});

module.exports = {
  listProducts,
};
