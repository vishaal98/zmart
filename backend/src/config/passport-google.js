const passport = require("passport");
// const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const config = require("./config");
const { model } = require("mongoose");

passport.use(
  new googleStrategy(
    {
      clientID: config.google.client_id,
      clientSecret: config.google.client_secrete,
      callbackURL: "http://localhost:8080/auth/google/callback",
      scope: ["profile", "email"],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // check if the user exists in the DB, if not then create the user
      //   const user = await userController.checkAndCreateUser(
      //     profile.emails[0].value
      //   );
      console.log("I an inside the call back of google strategy", profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
