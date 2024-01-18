const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const compression = require("compression");
const ApiError = require("./utils/apiError");
const httpStatus = require("http-status");
const passport = require("passport");
const helmet = require("helmet");
const session = require("express-session");
const { jwtStrategy } = require("./config/passport");
const passportGoogleStrategy = require("./config/passport-google");
const config = require("./config/config");

const app = express();
app.use(
  session({
    secret: "thisisasecreteforsession",
    resave: false,
    saveUninitialized: true,
  })
);

// enable cors
// const corsOptions = ;
app.use(cors());
app.options("*", cors());

app.use(passport.initialize());
app.use(passport.session());

passport.use("jwt", jwtStrategy);

// app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

app.use("/", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Not found: ${req.url}`));
});

module.exports = app;
