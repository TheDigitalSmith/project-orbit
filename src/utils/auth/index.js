const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../../schemas/users/index");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));
