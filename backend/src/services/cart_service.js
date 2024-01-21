const httpStatus = require("http-status");
const Cart = require("../models/cart_model");
const Product = require("../models/product_model");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const getProductsFromCart = async (userEmail) => {
  const cart = await Cart.findOne({ email: userEmail });
  return cart.cartItems;
};

const addProductToCart = async (productId, user, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist");
  }

  const cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    const updatedCart = await Cart.create({
      email: user.email,
      cartItems: [{ product: product._id, quantity: quantity }],
    });
    if (!updatedCart) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    }
    return updatedCart;
  }

  if (cart.cartItems.some((item) => item.product._id.equals(productId))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product already in cart. Use the cart sidebar to update or remove product from cart"
    );
  }

  cart.cartItems.push({
    product: product._id,
    quantity: quantity,
  });

  cart.save();
  return cart;
};

const updateProductCart = async (productId, user, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist");
  }

  const cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }

  const productIndexInTheCartItems = cart.cartItems.findIndex((item) =>
    item.product._id.equals(productId)
  );

  if (productIndexInTheCartItems < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in the cart"
    );
  }
  if (quantity > 0) {
    cart.cartItems[productIndexInTheCartItems].quantity = quantity;
  } else {
    cart.cartItems.splice(productIndexInTheCartItems, 1);
  }

  await cart.save();
  return cart;
};

const removeProductFromCart = async (productId, user) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist");
  }

  const cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }

  const productIndexInTheCartItems = cart.cartItems.findIndex((item) =>
    item.product._id.equals(productId)
  );
  cart.cartItems.splice(productIndexInTheCartItems, 1);
  await cart.save();
  return cart;
};

//use address ID for order history
const checkout = async (user, addressId) => {
  const cart = await Cart.findOne({ email: user.email }).populate({
    path: "cartItems.product",
    model: "Product",
  });
  const totalAmount = cart.cartItems.reduce((sum, item) => {
    return sum + item.quantity * item.product.cost;
  }, 0);

  user.walletMoney = user.walletMoney - totalAmount;
  cart.cartItems = [];
  await user.save();
  await cart.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    walletMoney: user.walletMoney,
  };
};

module.exports = {
  getProductsFromCart,
  addProductToCart,
  updateProductCart,
  removeProductFromCart,
  checkout,
};
