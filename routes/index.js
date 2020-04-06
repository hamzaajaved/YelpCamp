var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//root route
router.get("/", function(req, res) {
  res.render("Campgrounds/landing");
});

// ============================
// AUTHENTICATION ROUTES
// ============================

// SHOW REGISTER FORM
router.get("/register", function(req, res) {
  res.render("register");
});

// HANDLING REGISTER LOGIC
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to YelpCamp " + user.username);
        res.redirect("/campgrounds");
      });
    }
  });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res) {
  res.render("login");
});

// HANDLING LOGIN LOGIC
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
