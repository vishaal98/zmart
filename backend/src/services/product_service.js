const httpStatus = require("http-status");
const Product = require("../models/product_model");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const getProducts = async () => {
  const products = await Product.find({});
  return products;
};

const searchProducts = async (value) => {
  //Creating a RegEx to search
  const searchRegex = new RegExp(value.replace(/['"]+/g, ""), "i");

  const products = await Product.find({
    $or: [{ name: searchRegex }, { category: searchRegex }],
  }).exec();

  if (!products) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

  return products;
};

module.exports = {
  getProducts,
  searchProducts,
};
