const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const User = require("../models/user_model");
const Address = require("../models/address_model");
const Order = require("../models/order_model");

const createUser = async (user) => {
  if (await User.isEmailTaken(user.email)) {
    throw new ApiError(httpStatus.CONFLICT, "Email is already taken");
  }
  console.log(user);
  let salt = await bcrypt.genSalt();
  let hashedPassword = await bcrypt.hash(user.password, salt);
  let newUser = await User.create({
    ...user,
    password: hashedPassword,
  });

  // return newUser;
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    walletMoney: newUser.walletMoney,
  };
};

const getUserById = async (id) => {
  let user = await User.findOne({ _id: id });
  return user;
};

const getUserByEmail = async (email) => {
  let user = await User.findOne({ email: email });
  return user;
};

const updateUser = async (userId, userData) => {
  const { currentPassword, newPassword } = userData;
  let updateUserData = userData;

  if (currentPassword) {
    let user = await User.findOne({ _id: userId });
    let isPasswordMatch = user.isPasswordMatch(currentPassword);
    if (!isPasswordMatch)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Current password is incorrect"
      );

    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(newPassword, salt);
    updateUserData = {
      password: hashedPassword,
    };
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $set: updateUserData },
    { new: true }
  );

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    walletMoney: updatedUser.walletMoney,
  };
};

const getUserAddressById = async (id) => {
  const address = await User.findOne(
    { _id: id },
    { address: 1, email: 1 }
  ).populate("address");
  return address;
};

const setAddress = async (user, address) => {
  const newAddress = await Address.create(address);
  user.address.push(newAddress._id);
  await user.save();
  const userAddress = await user.populate("address");
  return userAddress.address;
};

const deleteAddress = async (user, addressId) => {
  console.log("user:", user, "address: ", addressId);
  if (!user.address.includes(addressId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address not found");
  }

  const changedAddress = await Address.findByIdAndDelete({ _id: addressId });

  console.log("changed Address", changedAddress);
  const addressIndex = user.address.indexOf(addressId);
  user.address.splice(addressIndex, 1);
  await user.save();

  const userAddress = await user.populate("address");
  console.log("userAddress", userAddress);
  return userAddress.address;
};

const getOrderHistory = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate({
      path: "items.product",
      model: "Product",
    })
    .populate({
      path: "address",
      model: "Address",
    });

  return orders;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  getUserAddressById,
  setAddress,
  deleteAddress,
  getOrderHistory,
};
