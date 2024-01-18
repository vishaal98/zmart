const Product = require("../models/product_model");
const catchAsync = require("../utils/catchAsync");

const getProducts = async () => {
  const products = await Product.find({});
  return products;
};

module.exports = {
  getProducts,
};
