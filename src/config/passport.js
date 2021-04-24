import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models";
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userFound = await User.findOne({ email });
      if (userFound) {
        return done(null, false, { message: "The username is already Taken" });
      }
      const newUser = new User();
      newUser.email = email;
      newUser.password = await User.encryptPassword(password);
      const userSaved = await newUser.save();
      req.flash("success", "Ingresa con tu nueva cuenta");
      return done(null, userSaved);
    }
  )
);
passport.use(
  "signin",
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
    },
    async (email, password, done) => {
      const userFound = await User.findOne({ email });
      if (!userFound) return done(null, false, { message: "Not User found." });
      const match = await userFound.matchPassword(password);
      if (!match) return done(null, false, { message: "Incorrect Password." });
      return done(null, userFound);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = (await User.findById(id)).toObject();
    if (user) {
      delete user.password;
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
