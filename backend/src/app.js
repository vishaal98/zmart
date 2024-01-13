const express = require("express");
const routes = require("./routes/v1");
const cors = require("cors");
const compression = require("compression");
const ApiError = require("./utils/apiError");
const httpStatus = require("http-status");
const passport = require("passport");
const helmet = require("helmet");
const { jwtStrategy } = require("./config/passport");

const app = express();

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

app.use("/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;
