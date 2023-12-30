const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const User = require("../models/user_model").User;

const createUser = async (user) => {
  if (await User.isEmailTaken(user.email)) {
    return new ApiError(httpStatus.OK, "Email is already taken");
  }

  let salt = await bcrypt.genSalt();
  let hashedPassword = await bcrypt.hash(user.password, salt);
  let newUser = await User.create({
    ...user,
    password: hashedPassword,
  });

  return newUser;
};

const getUserById = async (id) => {
  let user = await User.findOne({ _id: id });
  return user;
};

const getUserByEmail = async (email) => {
  let user = await User.findOne({ email: email });
  return user;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
