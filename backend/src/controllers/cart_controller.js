const catchAsync = require("../utils/catchAsync");
const { cartService } = require("../services");

const listCart = catchAsync(async (req, res) => {
  const productsInCart = await cartService.getProductsFromCart(req.user.email);
  res.send(productsInCart);
});

const addToCart = catchAsync(async (req, res) => {
  const updatedCart = await cartService.addProductToCart(
    req.body.productId,
    req.user,
    req.body.quantity
  );

  res.status(200).json({ updatedCart });
});

const updateCart = catchAsync(async (req, res) => {
  const updatedCart = await cartService.updateProductCart(
    req.body.productId,
    req.user,
    req.body.quantity
  );

  res.status(200).json({ updatedCart });
});

const removeFromCart = catchAsync(async (req, res) => {
  const updatedCart = await cartService.removeProductFromCart(
    req.body.productId,
    req.user
  );

  res.status(200).json({ updatedCart });
});

module.exports = {
  listCart,
  addToCart,
  updateCart,
  removeFromCart,
};
