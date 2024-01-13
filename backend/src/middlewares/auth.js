const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */
const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  console.log("User check: ", user);
  if (err || !user || info) {
    return reject(
      new ApiError(httpStatus.UNAUTHORIZED),
      "Please authenticate!"
    );
  }
  req.user = user;
  resolve();
};

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 *
 */
const auth = async (req, res, next) => {
  console.log("User: ", req.headers.authorization);
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
