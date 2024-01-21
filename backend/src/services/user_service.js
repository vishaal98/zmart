const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const User = require("../models/user_model");
const Address = require("../models/address_model");

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
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $set: userData },
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

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  getUserAddressById,
  setAddress,
  deleteAddress,
};
