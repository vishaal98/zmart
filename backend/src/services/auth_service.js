const httpStatus = require("http-status");
const userService = require("./user_service");
const ApiError = require("../utils/apiError");

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  const passwordMatches = await user.isPasswordMatch(password);

  if (!passwordMatches) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  // return user;
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
};

module.exports = {
  loginUserWithEmailAndPassword,
};
