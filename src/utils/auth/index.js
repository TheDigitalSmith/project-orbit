const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const {User} = require("../../schemas/users/index");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_PASSWORD,
};

passport.use(
  new JwtStrategy(jwtOpts, (jwtPayload, cb) => {
    User.findById(jwtPayload._id, (err, user) => {
      if (err) return cb(err, false);
      else if (user) return cb(null, user);
      else return cb(null, false);
    });
  })
);

module.exports = {
  getToken: (user) =>
    jwt.sign({ _id: user._id }, process.env.TOKEN_PASSWORD, {
      expiresIn: 3600 * 48,
    }),
};
