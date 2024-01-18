const mongoose = require("mongoose");
const config = require("../config/config");
const cartSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    paymentOption: {
      type: String,
      default: config.default_payment_option,
    },
  },
  {
    timestamps: false,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
