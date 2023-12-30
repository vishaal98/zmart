const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { tokenTypes } = require("../config/tokens");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    type,
    exp: expires,
    iat: Date.now(),
  };
  return jwt.sign(payload, secret);
};

const getAuthToken = async (user) => {
  const tokenExpire =
    Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  const accessToken = generateToken(user._id, tokenExpire, tokenTypes.ACCESS);
  return {
    access: {
      token: accessToken,
      expires: new Date(tokenExpire * 1000),
    },
  };
};

module.exports = {
  generateToken,
  getAuthToken,
};
