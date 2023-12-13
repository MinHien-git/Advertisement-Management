const express = require("express");
const { route } = require("express/lib/application");
const authentication_controller = require("../controllers/authentication.controller");
const passport = require("passport");
const { getDb } = require("../database/database");
const User = require("../models/users.model");
const facebookStrategy = require("passport-facebook").Strategy;
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const auth_ultis = require("../utils/authentication");

const router = express.Router();
require("dotenv").config();

passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
    },
    async function (accesToken, refreshToken, profile, cb) {
      const user = await getDb().collection("users").findOne({
        email: profile.emails[0].value,
      });

      if (!user) {
        console.log("Adding new facebook account");
        const user = new User(
          profile.emails[0].value,
          "",
          0,
          "",
          profile.displayName,
          "",
          "facebook"
        );
        await getDb()
          .collection("users")
          .insertOne({ ...user });
        return cb(null, profile);
      } else {
        console.log("Facebook User already exist in DB");
        return cb(null, profile);
      }
    }
  )
);

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      const user = await getDb().collection("users").findOne({
        email: profile.emails[0].value,
      });

      if (!user) {
        console.log("Adding new Google account");
        const user = new User(
          profile.emails[0].value,
          "",
          0,
          "",
          profile.displayName,
          "",
          "google"
        );
        await getDb()
          .collection("users")
          .insertOne({ ...user });
      } else {
        console.log("Google User already exist in DB");
      }
      return done(null, profile);
    }
  )
);

router.get("/login", authentication_controller._get_login);
router.post("/login", authentication_controller._login);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/auth/success");
  }
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/auth/success");
  }
);
router.get("/auth/success", async (request, response) => {
  const userInfo = {
    id: request.session.passport.user.id,
    email: request.session.passport.user.emails[0].value,
    provider: request.session.passport.user.provider,
  };

  console.log(userInfo);
  let _user = await getDb().collection("users").findOne({
    email: userInfo.email,
  });
  if (_user) {
    auth_ultis.create_user_session(request, _user, () => {
      return response.redirect("/");
    });
  } else {
    return response.redirect("/?login=failed");
  }
});
//auth/google
router.get("/register", authentication_controller._get_register);
router.post("/register", authentication_controller._register);

router.post("/logout", authentication_controller._logout);

router.get("/update", (request, response) => {});
router.post("/update/:id", authentication_controller._update_infomation);

router.post("/update-password", authentication_controller._update_password);

module.exports = router;
